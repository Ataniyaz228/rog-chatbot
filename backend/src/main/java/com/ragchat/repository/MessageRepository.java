package com.ragchat.repository;

import com.ragchat.model.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    
    // Find all messages for a conversation, ordered by time
    List<MessageEntity> findByConversationIdOrderByTimestampAsc(String conversationId);
    
    // Delete all messages for a conversation
    void deleteByConversationId(String conversationId);
}
