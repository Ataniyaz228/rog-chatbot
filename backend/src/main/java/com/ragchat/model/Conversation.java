package com.ragchat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    private String id;

    private String title;

    @Transient // Not stored in DB directly here, handled by Repository
    private List<Message> messages = new ArrayList<>();

    @Transient // Source of truth is DocumentInfoRepository (documents table)
    private List<String> documentIds = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Conversation() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
    public List<String> getDocumentIds() { return documentIds; }
    public void setDocumentIds(List<String> documentIds) { this.documentIds = documentIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // DTO class for API response compatibility
    public static class Message {
        private String role;
        private String content;
        private List<ChatResponse.SourceReference> sources;
        private LocalDateTime timestamp;

        public Message() {}

        public Message(String role, String content, List<ChatResponse.SourceReference> sources, LocalDateTime timestamp) {
            this.role = role;
            this.content = content;
            this.sources = sources;
            this.timestamp = timestamp;
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public List<ChatResponse.SourceReference> getSources() { return sources; }
        public void setSources(List<ChatResponse.SourceReference> sources) { this.sources = sources; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}
