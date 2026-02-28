package com.upes.campuschat.controller;

import com.upes.campuschat.dto.ConversationSummary;
import com.upes.campuschat.dto.PrivateMessageRequest;
import com.upes.campuschat.dto.PrivateMessageResponse;
import com.upes.campuschat.service.PrivateMessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dm")
public class PrivateMessageController {

    private final PrivateMessageService privateMessageService;

    public PrivateMessageController(PrivateMessageService privateMessageService) {
        this.privateMessageService = privateMessageService;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummary>> getConversations(Authentication auth) {
        return ResponseEntity.ok(privateMessageService.getConversations(getCurrentUserId(auth)));
    }

    @GetMapping("/conversations/{otherUserId}/messages")
    public ResponseEntity<List<PrivateMessageResponse>> getMessages(@PathVariable Long otherUserId, Authentication auth) {
        return ResponseEntity.ok(privateMessageService.getMessagesWith(getCurrentUserId(auth), otherUserId));
    }

    @PostMapping("/messages")
    public ResponseEntity<PrivateMessageResponse> sendMessage(@Valid @RequestBody PrivateMessageRequest request,
                                                              Authentication auth) {
        PrivateMessageResponse response = privateMessageService.sendMessage(getCurrentUserId(auth), request);
        return ResponseEntity.ok(response);
    }
}
