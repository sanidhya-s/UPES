package com.upes.campuschat.service;

import com.upes.campuschat.dto.ChannelRequest;
import com.upes.campuschat.dto.ChannelResponse;
import com.upes.campuschat.entity.Channel;
import com.upes.campuschat.entity.ChannelMember;
import com.upes.campuschat.entity.User;
import com.upes.campuschat.repository.ChannelMemberRepository;
import com.upes.campuschat.repository.ChannelRepository;
import com.upes.campuschat.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ChannelMemberRepository channelMemberRepository;
    private final UserRepository userRepository;

    public ChannelService(ChannelRepository channelRepository, ChannelMemberRepository channelMemberRepository,
                          UserRepository userRepository) {
        this.channelRepository = channelRepository;
        this.channelMemberRepository = channelMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChannelResponse createChannel(Long userId, ChannelRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Channel channel = new Channel();
        channel.setName(request.getName().trim());
        channel.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        channel.setCreatedBy(user);
        channel = channelRepository.save(channel);
        ChannelMember member = new ChannelMember();
        member.setChannel(channel);
        member.setUser(user);
        channelMemberRepository.save(member);
        return toResponse(channel);
    }

    public List<ChannelResponse> getMyChannels(Long userId) {
        return channelRepository.findChannelsByMemberUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ChannelResponse> getAllChannels() {
        return channelRepository.findAllWithCreator().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void joinChannel(Long userId, Long channelId) {
        if (channelMemberRepository.existsByChannelIdAndUserId(channelId, userId)) {
            return; // already a member
        }
        Channel channel = channelRepository.findById(channelId).orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        ChannelMember member = new ChannelMember();
        member.setChannel(channel);
        member.setUser(user);
        channelMemberRepository.save(member);
    }

    @Transactional
    public void leaveChannel(Long userId, Long channelId) {
        channelMemberRepository.deleteByChannelIdAndUserId(channelId, userId);
    }

    public ChannelResponse getChannel(Long channelId, Long userId) {
        Channel channel = channelRepository.findById(channelId).orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        if (!channelMemberRepository.existsByChannelIdAndUserId(channelId, userId)) {
            throw new IllegalArgumentException("Not a member of this channel");
        }
        return toResponse(channel);
    }

    private ChannelResponse toResponse(Channel c) {
        return new ChannelResponse(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getCreatedBy().getId(),
                c.getCreatedBy().getName(),
                c.getCreatedAt()
        );
    }
}
