package com.upes.campuschat.controller;

import com.upes.campuschat.dto.ChannelRequest;
import com.upes.campuschat.dto.ChannelResponse;
import com.upes.campuschat.service.ChannelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<ChannelResponse> createChannel(@Valid @RequestBody ChannelRequest request,
                                                         Authentication auth) {
        ChannelResponse response = channelService.createChannel(getCurrentUserId(auth), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ChannelResponse>> getMyChannels(Authentication auth) {
        return ResponseEntity.ok(channelService.getMyChannels(getCurrentUserId(auth)));
    }

    @GetMapping
    public ResponseEntity<List<ChannelResponse>> getAllChannels() {
        return ResponseEntity.ok(channelService.getAllChannels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChannelResponse> getChannel(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(channelService.getChannel(id, getCurrentUserId(auth)));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinChannel(@PathVariable Long id, Authentication auth) {
        channelService.joinChannel(getCurrentUserId(auth), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveChannel(@PathVariable Long id, Authentication auth) {
        channelService.leaveChannel(getCurrentUserId(auth), id);
        return ResponseEntity.ok().build();
    }
}
