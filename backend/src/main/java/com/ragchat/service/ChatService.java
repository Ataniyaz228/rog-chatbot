package com.ragchat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ragchat.config.AiConfig;
import com.ragchat.model.ChatRequest;
import com.ragchat.model.ChatResponse;
import com.ragchat.model.Conversation;
import com.ragchat.model.DocumentChunk;
import com.ragchat.repository.ConversationRepository;
import com.ragchat.repository.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final AiConfig config;
    private final RestTemplate restTemplate;
    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;
    private final DocumentService documentService;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatService(AiConfig config, RestTemplate restTemplate,
                       EmbeddingService embeddingService, VectorStoreService vectorStoreService,
                       DocumentService documentService,
                       ConversationRepository conversationRepository, MessageRepository messageRepository) {
        this.config = config;
        this.restTemplate = restTemplate;
        this.embeddingService = embeddingService;
        this.vectorStoreService = vectorStoreService;
        this.documentService = documentService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    public ChatResponse chat(ChatRequest request, String userId) {
        String conversationId = request.getConversationId();
        if (conversationId == null || conversationId.isBlank()) {
            conversationId = UUID.randomUUID().toString();
        }

        String finalConversationId = conversationId;
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setId(finalConversationId);
                    c.setUserId(userId);
                    c.setTitle(request.getMessage().length() > 50
                            ? request.getMessage().substring(0, 50) + "..."
                            : request.getMessage());
                    c.setCreatedAt(LocalDateTime.now());
                    c.setUpdatedAt(LocalDateTime.now());
                    return conversationRepository.save(c);
                });

        // Save User Message
        com.ragchat.model.MessageEntity userMsgEntity = new com.ragchat.model.MessageEntity(
                conversationId, "user", request.getMessage(), null, LocalDateTime.now()
        );
        messageRepository.save(userMsgEntity);

        // Vector Search
        List<DocumentChunk> relevantChunks = Collections.emptyList();
        Map<String, Double> scores = Collections.emptyMap();
        int chunkCount = vectorStoreService.getChunkCount(conversationId);

        if (chunkCount > 0) {
            double[] queryEmbedding = embeddingService.embed(request.getMessage());
            relevantChunks = vectorStoreService.search(conversationId, queryEmbedding);
            scores = vectorStoreService.searchWithScores(conversationId, queryEmbedding);
        }

        final Map<String, Double> finalScores = scores;

        // Limit context to ~40000 chars to leverage Claude Opus's large context window
        StringBuilder contextBuilder = new StringBuilder();
        for (DocumentChunk chunk : relevantChunks) {
            String entry = String.format("[Document: %s]\n%s", chunk.getDocumentName(), chunk.getContent());
            
            if (contextBuilder.length() + entry.length() > 40000) {
                // If context is still empty (first chunk is too big), truncate and add it
                if (contextBuilder.isEmpty()) {
                    contextBuilder.append(entry.substring(0, Math.min(entry.length(), 40000)));
                }
                break; // Stop adding more chunks
            }
            
            if (!contextBuilder.isEmpty()) contextBuilder.append("\n\n---\n\n");
            contextBuilder.append(entry);
        }
        String context = contextBuilder.toString();

        // Fetch history for context
        List<com.ragchat.model.MessageEntity> historyEntities = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        List<Conversation.Message> history = historyEntities.stream()
                .map(e -> new Conversation.Message(e.getRole(), e.getContent(), e.getSources(), e.getTimestamp()))
                .toList();

        // Generate Answer FIRST so we can use it for smart snippets
        String answer = generateAnswerWithRetry(request.getMessage(), context, history);

        List<ChatResponse.SourceReference> sources = relevantChunks.stream()
                .map(chunk -> {
                    ChatResponse.SourceReference ref = new ChatResponse.SourceReference();
                    ref.setDocumentName(chunk.getDocumentName());
                    ref.setSection(chunk.getSection()); // Include section in source
                    
                    // Generate smart snippet using BOTH query and the generated answer
                    String searchContext = request.getMessage() + " " + answer;
                    String snippet = generateSmartSnippet(chunk.getContent(), searchContext);
                    ref.setSnippet(snippet);
                    
                    ref.setRelevanceScore(finalScores.getOrDefault(chunk.getId(), 0.0));
                    return ref;
                })
                .toList();

        // Save Assistant Message
        com.ragchat.model.MessageEntity assistantMsgEntity = new com.ragchat.model.MessageEntity(
                conversationId, "assistant", answer, sources, LocalDateTime.now()
        );
        messageRepository.save(assistantMsgEntity);

        // Update Conversation Timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        ChatResponse response = new ChatResponse();
        response.setAnswer(answer);
        response.setConversationId(conversationId);
        response.setSources(sources);
        return response;
    }

    public List<Conversation> getConversations(String userId) {
        List<Conversation> convs = conversationRepository.findAllByUserIdOrderByUpdatedAtDesc(userId);
        // Populate messages for each conversation so the frontend shows correct counts/previews
        convs.forEach(c -> {
            List<com.ragchat.model.MessageEntity> msgEntities = messageRepository.findByConversationIdOrderByTimestampAsc(c.getId());
            List<Conversation.Message> messages = msgEntities.stream()
                    .map(e -> new Conversation.Message(e.getRole(), e.getContent(), e.getSources(), e.getTimestamp()))
                    .toList();
            c.setMessages(messages);
            
            // Also populate documentIds for completeness if needed by frontend
             List<String> docIds = documentService.getDocuments(c.getId()).stream()
                    .map(com.ragchat.model.DocumentInfo::getId)
                    .toList();
            c.setDocumentIds(docIds);
        });
        return convs;
    }

    public Conversation getConversation(String id) {
        return conversationRepository.findById(id).map(c -> {
            // Populate Messages
            List<com.ragchat.model.MessageEntity> msgEntities = messageRepository.findByConversationIdOrderByTimestampAsc(id);
            List<Conversation.Message> messages = msgEntities.stream()
                    .map(e -> new Conversation.Message(e.getRole(), e.getContent(), e.getSources(), e.getTimestamp()))
                    .toList();
            c.setMessages(messages);

            // Populate Document IDs
            List<String> docIds = documentService.getDocuments(id).stream()
                    .map(com.ragchat.model.DocumentInfo::getId)
                    .toList();
            c.setDocumentIds(docIds);

            return c;
        }).orElse(null);
    }

    @Transactional
    public void deleteConversation(String id) {
        // Delete documents (and their chunks)
        documentService.getDocuments(id).forEach(doc -> documentService.deleteDocument(doc.getId()));
        
        // Delete messages
        messageRepository.deleteByConversationId(id);
        
        // Delete conversation
        conversationRepository.deleteById(id);
    }

    private String generateSmartSnippet(String content, String query) {
        if (content == null || content.isEmpty()) return "";
        
        String contentLower = content.toLowerCase();
        // Extract keywords: words > 3 chars OR digits
        List<String> keywords = Arrays.stream(query.toLowerCase().split("\\s+"))
                .filter(w -> w.length() > 3 || w.matches(".*\\d.*"))
                .distinct()
                .toList();

        if (keywords.isEmpty()) {
            return content.length() > 150 ? content.substring(0, 150) + "..." : content;
        }

        // 1. Find all match positions for every keyword
        List<Integer> matchIndices = new ArrayList<>();
        for (String keyword : keywords) {
            java.util.regex.Pattern p;
            if (keyword.matches(".*\\d.*")) {
                 // Strict number matching
                 p = java.util.regex.Pattern.compile("(?<!\\d)" + java.util.regex.Pattern.quote(keyword) + "(?!\\d)");
            } else {
                 // Word matching
                 p = java.util.regex.Pattern.compile(java.util.regex.Pattern.quote(keyword));
            }
            java.util.regex.Matcher m = p.matcher(contentLower);
            while (m.find()) {
                matchIndices.add(m.start());
            }
        }
        
        Collections.sort(matchIndices);

        if (matchIndices.isEmpty()) {
             return content.length() > 150 ? content.substring(0, 150) + "..." : content;
        }

        // 2. Sliding window to find highest density of keywords
        int windowSize = 200;
        int bestStart = matchIndices.get(0);
        int maxDensity = 0;

        // Check windows starting at each match
        for (int i = 0; i < matchIndices.size(); i++) {
            int currentStart = matchIndices.get(i);
            int currentEnd = currentStart + windowSize;
            int density = 0;

            // Count matches in this window
            for (int j = i; j < matchIndices.size(); j++) {
                int pos = matchIndices.get(j);
                if (pos >= currentStart && pos < currentEnd) {
                    density++;
                } else if (pos >= currentEnd) {
                    break;
                }
            }
            
            if (density > maxDensity) {
                maxDensity = density;
                bestStart = currentStart;
            }
        }

        // 3. Extract best window
        int start = Math.max(0, bestStart - 40); // Add some context before
        int end = Math.min(content.length(), start + windowSize);
        
        // Adjust start if we hit end boundary
        if (end == content.length()) {
            start = Math.max(0, end - windowSize);
        }

        String snippet = content.substring(start, end);

        // Trim edges cleanly
        if (start > 0) snippet = "..." + snippet.substring(snippet.indexOf(' ') + 1);
        if (end < content.length()) snippet = snippet.substring(0, snippet.lastIndexOf(' ')) + "...";

        return snippet;
    }

    private String generateAnswerWithRetry(String question, String context, List<Conversation.Message> history) {
        // Try up to 2 times — on 429/rate-limit, reduce context and retry
        for (int attempt = 0; attempt < 2; attempt++) {
            String ctx = attempt == 0 ? context : context.substring(0, Math.min(context.length(), 10000));
            String result = generateAnswer(question, ctx, history, attempt > 0);
            if (result != null) return result;
            try {
                Thread.sleep(2000); // Wait 2 seconds before retry
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        return "Sorry, the AI service is temporarily overloaded. Please try again in a few seconds.";
    }

    private String generateAnswer(String question, String context, List<Conversation.Message> history, boolean reducedMode) {
        try {
            String url = config.getApiBaseUrl() + "/chat/completions";

            String systemPrompt = """
                    You are "Neural Core", a sophisticated AI assistant designed for deep document analysis and reasoning.
                    You have access to a vast context of provided documents.
                    
                    CRITICAL RULES:
                    1. NO EMOJIS: Never use emojis. Instead, use clean typography, bold headers, and structured lists for emphasis.
                    2. BASE YOUR ANSWERS ONLY ON THE PROVIDED DOCUMENT CONTEXT.
                    3. If the context doesn't contain the answer, state that clearly but try to offer relevant insights from the documents if possible.
                    4. USE YOUR ADVANCED REASONING: Analyze complex relationships across multiple document chunks.
                    5. CITATIONS: Always cite the document name and section when providing information.
                    6. LANGUAGE: Respond in the same language as the user.
                    7. FORMATTING: Use clean Markdown (headers, tables, bold text) for technical or structured data.
                    8. EXPLAIN YOUR LOGIC: If a query is complex, briefly explain how you arrived at the answer based on the documents.
                    9. AESTHETICS: Ensure the output looks professional, high-end, and structured. Use horizontal lines (---) to separate sections if helpful.
                    """;

            String userPrompt = context.isBlank()
                    ? "No documents have been uploaded yet. Please answer this general question:\n\n" + question
                    : "Based on the following document context, answer the question.\n\n"
                    + "DOCUMENT CONTEXT:\n" + context + "\n\nQUESTION: " + question;

            // Build messages array (OpenAI format)
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));

            // Add recent conversation history (Claude Opus can handle much more)
            int maxHistory = reducedMode ? 5 : 20;
            int startIdx = Math.max(0, history.size() - maxHistory);
            for (int i = startIdx; i < history.size() - 1; i++) {
                Conversation.Message msg = history.get(i);
                // Truncate very long messages in history to save tokens
                String content = msg.getContent();
                if (content != null && content.length() > 300) {
                    content = content.substring(0, 300) + "...";
                }
                messages.add(Map.of("role", msg.getRole(), "content", content != null ? content : ""));
            }

            messages.add(Map.of("role", "user", "content", userPrompt));

            // Build request body (OpenAI-compatible format)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", config.getChatModel());
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.5); // Lower temperature for more consistent reasoning
            requestBody.put("max_tokens", reducedMode ? 2000 : 4096);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(config.getApiKey());
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            return root.path("choices").get(0)
                    .path("message").path("content").asText();

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            int status = e.getStatusCode().value();
            log.error("AI API error - Status: {} Body: {}", status, e.getResponseBodyAsString());
            if (status == 429 || status == 503) {
                // Rate limit or overloaded — return null to trigger retry
                return null;
            }
            if (status == 413 || e.getResponseBodyAsString().contains("too large")) {
                return null; // Too large — retry with reduced context
            }
            return "Sorry, I encountered an error (" + status + "). Please try again.";
        } catch (Exception e) {
            log.error("Failed to generate answer: {}", e.getMessage(), e);
            return null;
        }
    }
}
