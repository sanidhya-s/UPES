package com.upes.campuschat.dto;

import java.time.Instant;

public class ConversationSummary {
    private Long otherUserId;
    private String otherUserName;
    private String lastMessagePreview;
    private Instant lastMessageAt;

    public ConversationSummary(Long otherUserId, String otherUserName, String lastMessagePreview, Instant lastMessageAt) {
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.lastMessagePreview = lastMessagePreview;
        this.lastMessageAt = lastMessageAt;
    }

    public Long getOtherUserId() { return otherUserId; }
    public String getOtherUserName() { return otherUserName; }
    public String getLastMessagePreview() { return lastMessagePreview; }
    public Instant getLastMessageAt() { return lastMessageAt; }
}
