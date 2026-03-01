package com.upes.campuschat.service;

import com.upes.campuschat.dto.ConversationSummary;
import com.upes.campuschat.dto.PrivateMessageRequest;
import com.upes.campuschat.dto.PrivateMessageResponse;
import com.upes.campuschat.entity.PrivateMessage;
import com.upes.campuschat.entity.User;
import com.upes.campuschat.repository.PrivateMessageRepository;
import com.upes.campuschat.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrivateMessageService {

    private final PrivateMessageRepository privateMessageRepository;
    private final UserRepository userRepository;

    public PrivateMessageService(PrivateMessageRepository privateMessageRepository, UserRepository userRepository) {
        this.privateMessageRepository = privateMessageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PrivateMessageResponse sendMessage(Long senderId, PrivateMessageRequest request) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        User recipient = userRepository.findById(request.getRecipientId()).orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
        if (senderId.equals(recipient.getId())) {
            throw new IllegalArgumentException("Cannot send message to yourself");
        }
        PrivateMessage pm = new PrivateMessage();
        pm.setContent(request.getContent().trim());
        pm.setSender(sender);
        pm.setRecipient(recipient);
        pm = privateMessageRepository.save(pm);
        return toResponse(pm);
    }

    public List<PrivateMessageResponse> getMessagesWith(Long userId, Long otherUserId) {
        if (userId.equals(otherUserId)) {
            return List.of();
        }
        return privateMessageRepository.findConversationBetween(userId, otherUserId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ConversationSummary> getConversations(Long userId) {
        List<Long> partnerIds = privateMessageRepository.findDistinctConversationPartnerIds(userId);
        List<ConversationSummary> result = new ArrayList<>();
        for (Long partnerId : partnerIds) {
            List<PrivateMessage> conv = privateMessageRepository.findConversationBetween(userId, partnerId);
            if (conv.isEmpty()) continue;
            PrivateMessage last = conv.get(conv.size() - 1);
            String otherName = last.getSender().getId().equals(partnerId) ? last.getSender().getName() : last.getRecipient().getName();
            String preview = last.getContent().length() > 60 ? last.getContent().substring(0, 60) + "..." : last.getContent();
            result.add(new ConversationSummary(partnerId, otherName, preview, last.getCreatedAt()));
        }
        result.sort((a, b) -> b.getLastMessageAt().compareTo(a.getLastMessageAt()));
        return result;
    }

    private PrivateMessageResponse toResponse(PrivateMessage pm) {
        return new PrivateMessageResponse(
                pm.getId(),
                pm.getContent(),
                pm.getSender().getId(),
                pm.getSender().getName(),
                pm.getRecipient().getId(),
                pm.getRecipient().getName(),
                pm.getCreatedAt()
        );
    }
}
