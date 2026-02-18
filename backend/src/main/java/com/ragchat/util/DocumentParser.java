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
import java.util.Map;

@Component
public class DocumentParser {

    private final Tika tika = new Tika();

    @Value("${rag.chunk-size:200}")
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
     * Splits text into pieces, attempting to detect sections.
     * Returns a list of Map.Entry<SectionName, ContentChunk>
     */
    public List<Map.Entry<String, String>> splitIntoSectionedChunks(String text) {
        List<Map.Entry<String, String>> chunks = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return chunks;
        }

        // 1. Split into lines to find headers
        String[] lines = text.split("\\r?\\n");
        String currentSection = "Introduction"; // Default section
        StringBuilder currentBuffer = new StringBuilder();

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) continue;

            // Simple heuristic for headers:
            // - Short (under 60 chars)
            // - Starts with number, or is all UPPERCASE, or doesn't end with punctuation
            boolean isHeader = trimmed.length() < 60 && 
                               (trimmed.matches("^\\d+\\..*") || 
                                trimmed.matches("^[A-ZА-Я0-9\\s\\-]+$") || 
                                !trimmed.matches(".*[.!?]$"));

            if (isHeader) {
                // If we have content in the buffer, save it with the OLD section
                if (currentBuffer.length() > 0) {
                    processBufferToChunks(currentBuffer.toString(), currentSection, chunks);
                    currentBuffer.setLength(0);
                }
                // Update current section to new header
                currentSection = trimmed;
            } else {
                if (currentBuffer.length() > 0) currentBuffer.append(" ");
                currentBuffer.append(trimmed);
            }
        }

        // Process remaining buffer
        if (currentBuffer.length() > 0) {
            processBufferToChunks(currentBuffer.toString(), currentSection, chunks);
        }

        return chunks;
    }

    private void processBufferToChunks(String text, String section, List<Map.Entry<String, String>> chunks) {
        String[] words = text.split("\\s+");
        if (words.length <= chunkSize) {
            chunks.add(Map.entry(section, text));
            return;
        }

        int step = chunkSize - chunkOverlap;
        for (int i = 0; i < words.length; i += step) {
            int end = Math.min(i + chunkSize, words.length);
            StringBuilder chunk = new StringBuilder();
            for (int j = i; j < end; j++) {
                if (j > i) chunk.append(" ");
                chunk.append(words[j]);
            }
            chunks.add(Map.entry(section, chunk.toString()));
            if (end == words.length) break;
        }
    }
}
