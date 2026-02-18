package com.ragchat.model;

import java.util.List;

public class ChatResponse {
    private String answer;
    private String conversationId;
    private List<SourceReference> sources;

    public ChatResponse() {}

    public ChatResponse(String answer, String conversationId, List<SourceReference> sources) {
        this.answer = answer;
        this.conversationId = conversationId;
        this.sources = sources;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    public List<SourceReference> getSources() { return sources; }
    public void setSources(List<SourceReference> sources) { this.sources = sources; }

    public static class SourceReference {
        private String documentName;
        private String snippet;
        private double relevanceScore;

        public SourceReference() {}

        public SourceReference(String documentName, String snippet, double relevanceScore) {
            this.documentName = documentName;
            this.snippet = snippet;
            this.relevanceScore = relevanceScore;
        }

        public String getDocumentName() { return documentName; }
        public void setDocumentName(String documentName) { this.documentName = documentName; }
        public String getSnippet() { return snippet; }
        public void setSnippet(String snippet) { this.snippet = snippet; }
        public double getRelevanceScore() { return relevanceScore; }
        public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }
    }
}
