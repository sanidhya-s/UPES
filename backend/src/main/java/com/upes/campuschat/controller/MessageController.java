package com.upes.campuschat.controller;

import com.upes.campuschat.dto.MessageRequest;
import com.upes.campuschat.dto.MessageResponse;
import com.upes.campuschat.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/channels/{channelId}/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(@PathVariable Long channelId,
                                                        @Valid @RequestBody MessageRequest request,
                                                        Authentication auth) {
        MessageResponse response = messageService.sendMessage(getCurrentUserId(auth), channelId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long channelId, Authentication auth) {
        return ResponseEntity.ok(messageService.getMessages(getCurrentUserId(auth), channelId));
    }
}
