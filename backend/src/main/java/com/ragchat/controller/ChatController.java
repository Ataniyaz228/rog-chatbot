package com.ragchat.controller;

import com.ragchat.model.ChatRequest;
import com.ragchat.model.Conversation;
import com.ragchat.model.User;
import com.ragchat.repository.UserRepository;
import com.ragchat.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;
    private final UserRepository userRepository;

    public ChatController(ChatService chatService, UserRepository userRepository) {
        this.chatService = chatService;
        this.userRepository = userRepository;
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        try {
            String userId = getCurrentUserId();
            return ResponseEntity.ok(chatService.chat(request, userId));
        } catch (Exception e) {
            log.error("Chat error: {}", e.getMessage(), e);
            Map<String, String> error = Map.of(
                    "error", e.getMessage() != null ? e.getMessage() : "Unknown error"
            );
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations() {
        String userId = getCurrentUserId();
        return ResponseEntity.ok(chatService.getConversations(userId));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<?> getConversation(@PathVariable String id) {
        String userId = getCurrentUserId();
        Conversation conversation = chatService.getConversation(id);
        if (conversation == null) return ResponseEntity.notFound().build();

        // Verify ownership
        if (!userId.equals(conversation.getUserId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        return ResponseEntity.ok(conversation);
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<?> deleteConversation(@PathVariable String id) {
        String userId = getCurrentUserId();
        Conversation conversation = chatService.getConversation(id);
        if (conversation == null) return ResponseEntity.notFound().build();

        // Verify ownership
        if (!userId.equals(conversation.getUserId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        chatService.deleteConversation(id);
        return ResponseEntity.ok().build();
    }
}
