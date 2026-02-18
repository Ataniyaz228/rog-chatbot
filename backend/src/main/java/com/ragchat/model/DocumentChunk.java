package com.ragchat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "document_chunks")
public class DocumentChunk {

    @Id
    private String id;

    @Column(name = "document_id")
    private String documentId;

    private String documentName;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int chunkIndex;

    @Column(name = "conversation_id")
    private String conversationId; // Optimization for faster lookups

    private String section; // e.g. "Introduction", "Summary"

    @Column(columnDefinition = "float8[]")
    private double[] embedding;

    public DocumentChunk() {}

    public DocumentChunk(String id, String documentId, String documentName, String content, int chunkIndex, double[] embedding) {
        this.id = id;
        this.documentId = documentId;
        this.documentName = documentName;
        this.content = content;
        this.chunkIndex = chunkIndex;
        this.embedding = embedding;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }
    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getChunkIndex() { return chunkIndex; }
    public void setChunkIndex(int chunkIndex) { this.chunkIndex = chunkIndex; }
    public double[] getEmbedding() { return embedding; }
    public void setEmbedding(double[] embedding) { this.embedding = embedding; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
}
