package com.ragchat.controller;

import com.ragchat.model.DocumentInfo;
import com.ragchat.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/plain",
            "text/csv",
            "text/markdown",
            "application/rtf"
    );

    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("conversationId") String conversationId) {

        // Validate file is not empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "File exceeds maximum size of 50MB"));
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Unsupported file type. Allowed: PDF, DOCX, XLSX, TXT, CSV, Markdown, RTF"
            ));
        }

        DocumentInfo result = documentService.uploadDocument(file, conversationId);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<DocumentInfo>> getDocuments(
            @RequestParam("conversationId") String conversationId) {
        return ResponseEntity.ok(documentService.getDocuments(conversationId));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable String documentId) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok().build();
    }
}
