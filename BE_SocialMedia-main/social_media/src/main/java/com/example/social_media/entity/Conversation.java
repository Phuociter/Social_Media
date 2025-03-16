package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "conversation")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer conversationId;

    @Column(length = 100)
    private String conversationName;

    // MỚI: Xác định đây có phải nhóm chat hay không
    @Column(nullable = false)
    private Boolean isGroup = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt = new Date();
}

