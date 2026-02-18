package com.ragchat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ragchat.config.GeminiConfig;
import com.ragchat.model.ChatRequest;
import com.ragchat.model.ChatResponse;
import com.ragchat.model.Conversation;
import com.ragchat.model.DocumentChunk;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final GeminiConfig config;
    private final RestTemplate restTemplate;
    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Conversation> conversations = new ConcurrentHashMap<>();

    public ChatService(GeminiConfig config, RestTemplate restTemplate,
                       EmbeddingService embeddingService, VectorStoreService vectorStoreService) {
        this.config = config;
        this.restTemplate = restTemplate;
        this.embeddingService = embeddingService;
        this.vectorStoreService = vectorStoreService;
    }

    public ChatResponse chat(ChatRequest request) {
        String conversationId = request.getConversationId();
        if (conversationId == null || conversationId.isBlank()) {
            conversationId = UUID.randomUUID().toString();
        }

        Conversation conversation = conversations.computeIfAbsent(conversationId, id -> {
            Conversation c = new Conversation();
            c.setId(id);
            c.setTitle(request.getMessage().length() > 50
                    ? request.getMessage().substring(0, 50) + "..."
                    : request.getMessage());
            c.setMessages(new ArrayList<>());
            c.setDocumentIds(new ArrayList<>());
            c.setCreatedAt(LocalDateTime.now());
            c.setUpdatedAt(LocalDateTime.now());
            return c;
        });

        Conversation.Message userMsg = new Conversation.Message();
        userMsg.setRole("user");
        userMsg.setContent(request.getMessage());
        userMsg.setTimestamp(LocalDateTime.now());
        conversation.getMessages().add(userMsg);

        // Only embed the query if there are documents to search against
        List<DocumentChunk> relevantChunks = Collections.emptyList();
        Map<String, Double> scores = Collections.emptyMap();
        int chunkCount = vectorStoreService.getChunkCount(conversationId);

        if (chunkCount > 0) {
            double[] queryEmbedding = embeddingService.embed(request.getMessage());
            relevantChunks = vectorStoreService.search(conversationId, queryEmbedding);
            scores = vectorStoreService.searchWithScores(conversationId, queryEmbedding);
        }

        final Map<String, Double> finalScores = scores;

        String context = relevantChunks.stream()
                .map(chunk -> String.format("[Document: %s]\n%s", chunk.getDocumentName(), chunk.getContent()))
                .collect(Collectors.joining("\n\n---\n\n"));

        List<ChatResponse.SourceReference> sources = relevantChunks.stream()
                .map(chunk -> {
                    ChatResponse.SourceReference ref = new ChatResponse.SourceReference();
                    ref.setDocumentName(chunk.getDocumentName());
                    ref.setSnippet(chunk.getContent().length() > 150
                            ? chunk.getContent().substring(0, 150) + "..."
                            : chunk.getContent());
                    ref.setRelevanceScore(finalScores.getOrDefault(chunk.getId(), 0.0));
                    return ref;
                })
                .toList();

        String answer = generateAnswer(request.getMessage(), context, conversation.getMessages());

        Conversation.Message assistantMsg = new Conversation.Message();
        assistantMsg.setRole("assistant");
        assistantMsg.setContent(answer);
        assistantMsg.setSources(sources);
        assistantMsg.setTimestamp(LocalDateTime.now());
        conversation.getMessages().add(assistantMsg);
        conversation.setUpdatedAt(LocalDateTime.now());

        ChatResponse response = new ChatResponse();
        response.setAnswer(answer);
        response.setConversationId(conversationId);
        response.setSources(sources);
        return response;
    }

    public List<Conversation> getConversations() {
        return conversations.values().stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .toList();
    }

    public Conversation getConversation(String id) {
        return conversations.get(id);
    }

    public void deleteConversation(String id) {
        conversations.remove(id);
    }

    private String generateAnswer(String question, String context, List<Conversation.Message> history) {
        try {
            String url = config.getApiBaseUrl() + "/chat/completions";

            String systemPrompt = """
                    You are a helpful AI assistant that answers questions based on the provided documents.
                    Always base your answers on the document context provided.
                    If the context doesn't contain relevant information, say so honestly.
                    Be specific and cite which document the information comes from.
                    Respond in the same language as the user's question.
                    Format your response using Markdown when helpful.
                    """;

            String userPrompt = context.isBlank()
                    ? "No documents have been uploaded yet. Please answer this general question:\n\n" + question
                    : "Based on the following document context, answer the question.\n\n"
                    + "DOCUMENT CONTEXT:\n" + context + "\n\nQUESTION: " + question;

            // Build messages array (OpenAI format)
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));

            // Add recent conversation history (last 10 messages)
            int startIdx = Math.max(0, history.size() - 10);
            for (int i = startIdx; i < history.size() - 1; i++) {
                Conversation.Message msg = history.get(i);
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }

            messages.add(Map.of("role", "user", "content", userPrompt));

            // Build request body (OpenAI-compatible format)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", config.getChatModel());
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2048);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(config.getApiKey());
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            return root.path("choices").get(0)
                    .path("message").path("content").asText();

        } catch (Exception e) {
            log.error("Failed to generate answer: {}", e.getMessage(), e);
            return "Sorry, I encountered an error while generating a response. Please try again.";
        }
    }
}
