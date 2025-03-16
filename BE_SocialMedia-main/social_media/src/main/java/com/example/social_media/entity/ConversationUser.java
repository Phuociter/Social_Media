package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "conversation_user")
public class ConversationUser {
    @EmbeddedId
    private ConversationUserId id;

    @ManyToOne
    @MapsId("conversationId")
    @JoinColumn(name = "ConversationID", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    // MỚI: Vai trò trong cuộc trò chuyện (owner, admin, member)
    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private RoleInConversation roleInConversation = RoleInConversation.MEMBER;

    public enum RoleInConversation {
        OWNER, ADMIN, MEMBER
    }
}

