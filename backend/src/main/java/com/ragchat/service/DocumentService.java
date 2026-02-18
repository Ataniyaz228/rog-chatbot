package com.ragchat.service;

import com.ragchat.model.DocumentChunk;
import com.ragchat.model.DocumentInfo;
import com.ragchat.util.DocumentParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DocumentService {

    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentParser documentParser;
    private final EmbeddingService embeddingService;
    private final VectorStoreService vectorStoreService;

    private final Map<String, DocumentInfo> documents = new ConcurrentHashMap<>();
    private final Map<String, List<String>> conversationDocuments = new ConcurrentHashMap<>();

    public DocumentService(DocumentParser documentParser, EmbeddingService embeddingService, VectorStoreService vectorStoreService) {
        this.documentParser = documentParser;
        this.embeddingService = embeddingService;
        this.vectorStoreService = vectorStoreService;
    }

    public DocumentInfo uploadDocument(MultipartFile file, String conversationId) {
        String documentId = UUID.randomUUID().toString();
        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown";

        DocumentInfo docInfo = new DocumentInfo();
        docInfo.setId(documentId);
        docInfo.setName(fileName);
        docInfo.setType(file.getContentType());
        docInfo.setSize(file.getSize());
        docInfo.setConversationId(conversationId);
        docInfo.setUploadedAt(LocalDateTime.now());
        docInfo.setStatus("PROCESSING");

        documents.put(documentId, docInfo);
        conversationDocuments.computeIfAbsent(conversationId, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(documentId);

        try {
            String text = documentParser.extractText(file);
            log.info("Extracted {} characters from document: {}", text.length(), fileName);

            List<String> chunks = documentParser.splitIntoChunks(text);
            log.info("Split into {} chunks", chunks.size());

            for (int i = 0; i < chunks.size(); i++) {
                String chunkText = chunks.get(i);
                double[] embedding = embeddingService.embed(chunkText);

                DocumentChunk chunk = new DocumentChunk();
                chunk.setId(UUID.randomUUID().toString());
                chunk.setDocumentId(documentId);
                chunk.setDocumentName(fileName);
                chunk.setContent(chunkText);
                chunk.setChunkIndex(i);
                chunk.setEmbedding(embedding);

                vectorStoreService.addChunk(conversationId, chunk);
            }

            docInfo.setTotalChunks(chunks.size());
            docInfo.setStatus("READY");
            log.info("Document processed successfully: {} ({} chunks)", fileName, chunks.size());

        } catch (Exception e) {
            log.error("Failed to process document: {}", fileName, e);
            docInfo.setStatus("ERROR");
        }

        return docInfo;
    }

    public List<DocumentInfo> getDocuments(String conversationId) {
        List<String> docIds = conversationDocuments.getOrDefault(conversationId, Collections.emptyList());
        return docIds.stream()
                .map(documents::get)
                .filter(Objects::nonNull)
                .toList();
    }

    public void deleteDocument(String documentId) {
        DocumentInfo docInfo = documents.remove(documentId);
        if (docInfo != null) {
            vectorStoreService.removeDocument(docInfo.getConversationId(), documentId);
            List<String> docIds = conversationDocuments.get(docInfo.getConversationId());
            if (docIds != null) {
                docIds.remove(documentId);
            }
        }
    }
}
