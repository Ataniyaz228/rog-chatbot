package com.ragchat.service;

import com.ragchat.model.DocumentChunk;
import com.ragchat.repository.DocumentChunkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class VectorStoreService {

    private static final Logger log = LoggerFactory.getLogger(VectorStoreService.class);

    private final DocumentChunkRepository chunkRepository;

    @Value("${rag.top-k:5}")
    private int topK;

    public VectorStoreService(DocumentChunkRepository chunkRepository) {
        this.chunkRepository = chunkRepository;
    }

    public void addChunk(String conversationId, DocumentChunk chunk) {
        chunk.setConversationId(conversationId);
        chunkRepository.save(chunk);
    }

    public List<DocumentChunk> search(String conversationId, double[] queryEmbedding) {
        List<DocumentChunk> chunks = chunkRepository.findByConversationId(conversationId);
        if (chunks.isEmpty()) return Collections.emptyList();

        return chunks.stream()
                .map(chunk -> Map.entry(chunk, cosineSimilarity(queryEmbedding, chunk.getEmbedding())))
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    public Map<String, Double> searchWithScores(String conversationId, double[] queryEmbedding) {
        List<DocumentChunk> chunks = chunkRepository.findByConversationId(conversationId);
        if (chunks.isEmpty()) return Collections.emptyMap();

        return chunks.stream()
                .map(chunk -> Map.entry(chunk.getId(), cosineSimilarity(queryEmbedding, chunk.getEmbedding())))
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));
    }

    public void removeDocument(String conversationId, String documentId) {
        chunkRepository.deleteByDocumentId(documentId);
    }

    public int getChunkCount(String conversationId) {
        return chunkRepository.findByConversationId(conversationId).size();
    }

    private double cosineSimilarity(double[] a, double[] b) {
        if (a == null || b == null || a.length != b.length) return 0.0;
        double dotProduct = 0.0, normA = 0.0, normB = 0.0;
        for (int i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        double denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator == 0 ? 0.0 : dotProduct / denominator;
    }
}
