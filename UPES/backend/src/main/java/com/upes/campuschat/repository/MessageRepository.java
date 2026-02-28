package com.upes.campuschat.repository;

import com.upes.campuschat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m JOIN FETCH m.sender WHERE m.channel.id = :channelId ORDER BY m.createdAt ASC")
    List<Message> findByChannelIdOrderByCreatedAtAsc(Long channelId);
}
