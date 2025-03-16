package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "message")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageId;

    @ManyToOne
    @JoinColumn(name = "ConversationID", nullable = false)
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "SenderID", nullable = false)
    private User sender;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String messageContent;

    // MỚI: Đánh dấu tin nhắn đã đọc hay chưa
    @Column(nullable = false)
    private Boolean isRead = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();
}

