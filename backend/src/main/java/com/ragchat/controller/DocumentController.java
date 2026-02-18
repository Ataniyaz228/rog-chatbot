package com.ragchat.controller;

import com.ragchat.model.DocumentInfo;
import com.ragchat.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentInfo> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("conversationId") String conversationId) {
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
