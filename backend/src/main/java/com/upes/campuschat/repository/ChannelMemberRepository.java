package com.upes.campuschat.repository;

import com.upes.campuschat.entity.ChannelMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChannelMemberRepository extends JpaRepository<ChannelMember, Long> {
    Optional<ChannelMember> findByChannelIdAndUserId(Long channelId, Long userId);
    boolean existsByChannelIdAndUserId(Long channelId, Long userId);
    void deleteByChannelIdAndUserId(Long channelId, Long userId);
}
