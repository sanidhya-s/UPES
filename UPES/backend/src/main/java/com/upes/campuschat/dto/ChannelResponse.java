package com.upes.campuschat.dto;

import java.time.Instant;

public class ChannelResponse {
    private Long id;
    private String name;
    private String description;
    private Long createdById;
    private String createdByName;
    private Instant createdAt;

    public ChannelResponse(Long id, String name, String description, Long createdById, String createdByName, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdById = createdById;
        this.createdByName = createdByName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Long getCreatedById() { return createdById; }
    public String getCreatedByName() { return createdByName; }
    public Instant getCreatedAt() { return createdAt; }
}
