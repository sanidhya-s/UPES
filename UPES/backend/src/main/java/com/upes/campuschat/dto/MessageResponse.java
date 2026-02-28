package com.upes.campuschat.dto;

import java.time.Instant;

public class MessageResponse {
    private Long id;
    private String content;
    private Long channelId;
    private Long senderId;
    private String senderName;
    private Instant createdAt;

    public MessageResponse(Long id, String content, Long channelId, Long senderId, String senderName, Instant createdAt) {
        this.id = id;
        this.content = content;
        this.channelId = channelId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public Long getChannelId() { return channelId; }
    public Long getSenderId() { return senderId; }
    public String getSenderName() { return senderName; }
    public Instant getCreatedAt() { return createdAt; }
}
