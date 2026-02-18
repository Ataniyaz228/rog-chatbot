package com.ragchat.model;

public class DocumentChunk {
    private String id;
    private String documentId;
    private String documentName;
    private String content;
    private int chunkIndex;
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
}
