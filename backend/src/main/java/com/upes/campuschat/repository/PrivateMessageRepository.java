package com.upes.campuschat.repository;

import com.upes.campuschat.entity.PrivateMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, Long> {

    @Query("SELECT pm FROM PrivateMessage pm JOIN FETCH pm.sender JOIN FETCH pm.recipient " +
           "WHERE (pm.sender.id = :userId AND pm.recipient.id = :otherUserId) " +
           "   OR (pm.sender.id = :otherUserId AND pm.recipient.id = :userId) " +
           "ORDER BY pm.createdAt ASC")
    List<PrivateMessage> findConversationBetween(Long userId, Long otherUserId);

    @Query(value = "SELECT DISTINCT CASE WHEN sender_id = ?1 THEN recipient_id ELSE sender_id END AS other_user_id " +
           "FROM private_messages WHERE sender_id = ?1 OR recipient_id = ?1", nativeQuery = true)
    List<Long> findDistinctConversationPartnerIds(Long userId);
}
