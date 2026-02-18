package com.ragchat.repository;

import com.ragchat.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {
    
    // Find all conversations, sorted by last update time (descending)
    List<Conversation> findAllByOrderByUpdatedAtDesc();
    
}
