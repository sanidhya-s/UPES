package com.upes.campuschat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrivateMessageRequest {

    @NotNull(message = "Recipient is required")
    private Long recipientId;

    @NotBlank(message = "Message content is required")
    @Size(max = 2000)
    private String content;

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
