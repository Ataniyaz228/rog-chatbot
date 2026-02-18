package com.ragchat.model;

import java.time.LocalDateTime;

public class DocumentInfo {
    private String id;
    private String name;
    private String type;
    private long size;
    private int totalChunks;
    private String conversationId;
    private LocalDateTime uploadedAt;
    private String status;

    public DocumentInfo() {}

    public DocumentInfo(String id, String name, String type, long size, int totalChunks, String conversationId, LocalDateTime uploadedAt, String status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.totalChunks = totalChunks;
        this.conversationId = conversationId;
        this.uploadedAt = uploadedAt;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }
    public int getTotalChunks() { return totalChunks; }
    public void setTotalChunks(int totalChunks) { this.totalChunks = totalChunks; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
