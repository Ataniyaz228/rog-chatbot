package com.ragchat.util;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class DocumentParser {

    private final Tika tika = new Tika();

    @Value("${rag.chunk-size:500}")
    private int chunkSize;

    @Value("${rag.chunk-overlap:50}")
    private int chunkOverlap;

    /**
     * Extracts text from any supported document type using Apache Tika.
     */
    public String extractText(MultipartFile file) throws IOException, TikaException {
        try (InputStream stream = file.getInputStream()) {
            return tika.parseToString(stream);
        }
    }

    /**
     * Splits text into overlapping chunks for embedding.
     */
    public List<String> splitIntoChunks(String text) {
        List<String> chunks = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return chunks;
        }

        // Normalize whitespace
        text = text.replaceAll("\\s+", " ").trim();

        String[] words = text.split("\\s+");
        if (words.length <= chunkSize) {
            chunks.add(text);
            return chunks;
        }

        int step = chunkSize - chunkOverlap;
        for (int i = 0; i < words.length; i += step) {
            int end = Math.min(i + chunkSize, words.length);
            StringBuilder chunk = new StringBuilder();
            for (int j = i; j < end; j++) {
                if (j > i) chunk.append(" ");
                chunk.append(words[j]);
            }
            chunks.add(chunk.toString());
            if (end == words.length) break;
        }

        return chunks;
    }
}
