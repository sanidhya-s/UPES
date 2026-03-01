package com.upes.campuschat.repository;

import com.upes.campuschat.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ChannelRepository extends JpaRepository<Channel, Long> {

    @Query("SELECT DISTINCT c FROM Channel c LEFT JOIN FETCH c.createdBy " +
           "WHERE c.id IN (SELECT cm.channel.id FROM ChannelMember cm WHERE cm.user.id = :userId) " +
           "ORDER BY c.name")
    List<Channel> findChannelsByMemberUserId(Long userId);

    @Query("SELECT c FROM Channel c LEFT JOIN FETCH c.createdBy ORDER BY c.createdAt DESC")
    List<Channel> findAllWithCreator();
}
