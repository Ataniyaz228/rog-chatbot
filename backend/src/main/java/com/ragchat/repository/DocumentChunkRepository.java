package com.ragchat.repository;

import com.ragchat.model.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, String> {
    
    List<DocumentChunk> findByConversationId(String conversationId);
    
    void deleteByConversationId(String conversationId);
    
    void deleteByDocumentId(String documentId);
}
