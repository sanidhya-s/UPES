package com.upes.campuschat.service;

import com.upes.campuschat.dto.MessageRequest;
import com.upes.campuschat.dto.MessageResponse;
import com.upes.campuschat.entity.Channel;
import com.upes.campuschat.entity.Message;
import com.upes.campuschat.entity.User;
import com.upes.campuschat.repository.ChannelMemberRepository;
import com.upes.campuschat.repository.ChannelRepository;
import com.upes.campuschat.repository.MessageRepository;
import com.upes.campuschat.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;
    private final ChannelMemberRepository channelMemberRepository;

    public MessageService(MessageRepository messageRepository, ChannelRepository channelRepository,
                          UserRepository userRepository, ChannelMemberRepository channelMemberRepository) {
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
        this.channelMemberRepository = channelMemberRepository;
    }

    @Transactional
    public MessageResponse sendMessage(Long userId, Long channelId, MessageRequest request) {
        if (!channelMemberRepository.existsByChannelIdAndUserId(channelId, userId)) {
            throw new IllegalArgumentException("Not a member of this channel");
        }
        Channel channel = channelRepository.findById(channelId).orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Message message = new Message();
        message.setContent(request.getContent().trim());
        message.setChannel(channel);
        message.setSender(user);
        message = messageRepository.save(message);
        return toResponse(message);
    }

    public List<MessageResponse> getMessages(Long userId, Long channelId) {
        if (!channelMemberRepository.existsByChannelIdAndUserId(channelId, userId)) {
            throw new IllegalArgumentException("Not a member of this channel");
        }
        return messageRepository.findByChannelIdOrderByCreatedAtAsc(channelId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse toResponse(Message m) {
        return new MessageResponse(
                m.getId(),
                m.getContent(),
                m.getChannel().getId(),
                m.getSender().getId(),
                m.getSender().getName(),
                m.getCreatedAt()
        );
    }
}
