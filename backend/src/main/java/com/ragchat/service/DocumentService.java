package com.ragchat.service;

import com.ragchat.model.DocumentChunk;
import com.ragchat.model.DocumentInfo;
import com.ragchat.repository.DocumentInfoRepository;
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
    private final DocumentInfoRepository documentInfoRepository;

    public DocumentService(DocumentParser documentParser, EmbeddingService embeddingService, 
                           VectorStoreService vectorStoreService, DocumentInfoRepository documentInfoRepository) {
        this.documentParser = documentParser;
        this.embeddingService = embeddingService;
        this.vectorStoreService = vectorStoreService;
        this.documentInfoRepository = documentInfoRepository;
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

        documentInfoRepository.save(docInfo);

        try {
            String fullText = documentParser.extractText(file);
            log.info("Extracted {} characters from document: {}", fullText.length(), fileName);

            List<Map.Entry<String, String>> chunks = documentParser.splitIntoSectionedChunks(fullText);
            log.info("Split into {} chunks", chunks.size());

            for (int i = 0; i < chunks.size(); i++) {
                Map.Entry<String, String> entry = chunks.get(i);
                String section = entry.getKey();
                String content = entry.getValue();

                DocumentChunk chunk = new DocumentChunk();
                chunk.setId(UUID.randomUUID().toString());
                chunk.setDocumentId(documentId);
                chunk.setDocumentName(fileName);
                chunk.setContent(content);
                chunk.setSection(section); // Save the detected section
                chunk.setChunkIndex(i);
                chunk.setConversationId(conversationId);
                chunk.setEmbedding(embeddingService.embed(content));

                vectorStoreService.addChunk(conversationId, chunk);
            }
        
            docInfo.setTotalChunks(chunks.size());
            docInfo.setStatus("READY");
            documentInfoRepository.save(docInfo); // Update status
            log.info("Document processed successfully: {} ({} chunks)", fileName, chunks.size());

        } catch (Exception e) {
            log.error("Failed to process document: {}", fileName, e);
            docInfo.setStatus("ERROR");
            documentInfoRepository.save(docInfo); // Update status
        }

        return docInfo;
    }

    public List<DocumentInfo> getDocuments(String conversationId) {
        return documentInfoRepository.findByConversationId(conversationId);
    }

    public void deleteDocument(String documentId) {
        Optional<DocumentInfo> docInfoOpt = documentInfoRepository.findById(documentId);
        if (docInfoOpt.isPresent()) {
            DocumentInfo docInfo = docInfoOpt.get();
            vectorStoreService.removeDocument(docInfo.getConversationId(), documentId);
            documentInfoRepository.deleteById(documentId);
        }
    }
}
