package com.ragchat.repository;

import com.ragchat.model.DocumentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentInfoRepository extends JpaRepository<DocumentInfo, String> {
    
    List<DocumentInfo> findByConversationId(String conversationId);
    
}
