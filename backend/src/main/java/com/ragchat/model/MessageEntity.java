package com.ragchat.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conversation_id")
    private String conversationId;

    private String role; // "user" or "assistant"

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String sourcesJson; // Store sources as JSON string

    private LocalDateTime timestamp;

    public MessageEntity() {}

    public MessageEntity(String conversationId, String role, String content, List<ChatResponse.SourceReference> sources, LocalDateTime timestamp) {
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.timestamp = timestamp;
        setSources(sources);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Helper to convert JSON <-> Object
    private static final ObjectMapper mapper = new ObjectMapper();

    public List<ChatResponse.SourceReference> getSources() {
        if (sourcesJson == null || sourcesJson.isBlank()) return null;
        try {
            return mapper.readValue(sourcesJson, new TypeReference<List<ChatResponse.SourceReference>>() {});
        } catch (IOException e) {
            return null;
        }
    }

    public void setSources(List<ChatResponse.SourceReference> sources) {
        if (sources == null) {
            this.sourcesJson = null;
            return;
        }
        try {
            this.sourcesJson = mapper.writeValueAsString(sources);
        } catch (JsonProcessingException e) {
            this.sourcesJson = "[]";
        }
    }
}
