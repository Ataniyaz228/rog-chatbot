package com.ragchat.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Local embedding service using TF-IDF-like bag-of-words approach.
 * No external API needed — runs entirely locally.
 */
@Service
public class EmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingService.class);
    private static final int VECTOR_SIZE = 512;

    public double[] embed(String text) {
        if (text == null || text.isBlank()) {
            return new double[VECTOR_SIZE];
        }

        // Tokenize and normalize
        String[] words = text.toLowerCase()
                .replaceAll("[^a-zа-яёA-ZА-ЯЁ0-9\\s]", " ")
                .split("\\s+");

        // Create a hash-based feature vector (feature hashing / hashing trick)
        double[] vector = new double[VECTOR_SIZE];
        Map<String, Integer> wordFreq = new HashMap<>();

        for (String word : words) {
            if (word.length() > 1) {
                wordFreq.merge(word, 1, Integer::sum);
            }
        }

        for (Map.Entry<String, Integer> entry : wordFreq.entrySet()) {
            int hash = Math.abs(entry.getKey().hashCode());
            int index = hash % VECTOR_SIZE;
            vector[index] += entry.getValue();

            // Also add bigram-like features using character n-grams
            String word = entry.getKey();
            if (word.length() >= 3) {
                for (int i = 0; i <= word.length() - 3; i++) {
                    int ngramHash = Math.abs(word.substring(i, i + 3).hashCode());
                    int ngramIndex = ngramHash % VECTOR_SIZE;
                    vector[ngramIndex] += 0.5 * entry.getValue();
                }
            }
        }

        // L2 normalize
        double norm = 0;
        for (double v : vector) norm += v * v;
        norm = Math.sqrt(norm);
        if (norm > 0) {
            for (int i = 0; i < vector.length; i++) {
                vector[i] /= norm;
            }
        }

        return vector;
    }

    public List<double[]> embedBatch(List<String> texts) {
        return texts.stream().map(this::embed).collect(Collectors.toList());
    }
}
