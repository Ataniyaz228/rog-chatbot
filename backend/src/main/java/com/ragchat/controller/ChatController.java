package com.ragchat.controller;

import com.ragchat.model.ChatRequest;
import com.ragchat.model.ChatResponse;
import com.ragchat.model.Conversation;
import com.ragchat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        try {
            return ResponseEntity.ok(chatService.chat(request));
        } catch (Exception e) {
            e.printStackTrace();
            java.util.Map<String, String> error = new java.util.HashMap<>();
            error.put("error", e.getMessage());
            error.put("cause", e.getCause() != null ? e.getCause().getMessage() : "unknown");
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations() {
        return ResponseEntity.ok(chatService.getConversations());
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<Conversation> getConversation(@PathVariable String id) {
        Conversation conversation = chatService.getConversation(id);
        if (conversation == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(conversation);
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable String id) {
        chatService.deleteConversation(id);
        return ResponseEntity.ok().build();
    }
}
