package com.upes.campuschat.dto;

import java.time.Instant;

public class PrivateMessageResponse {
    private Long id;
    private String content;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private String recipientName;
    private Instant createdAt;

    public PrivateMessageResponse(Long id, String content, Long senderId, String senderName,
                                  Long recipientId, String recipientName, Instant createdAt) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.senderName = senderName;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public Long getSenderId() { return senderId; }
    public String getSenderName() { return senderName; }
    public Long getRecipientId() { return recipientId; }
    public String getRecipientName() { return recipientName; }
    public Instant getCreatedAt() { return createdAt; }
}
