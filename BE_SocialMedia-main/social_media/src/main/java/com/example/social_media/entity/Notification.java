package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Integer notificationId;

    // Người nhận thông báo
    @ManyToOne
    @JoinColumn(name = "user_id ", nullable = false)
    private User user;

    // Người gây ra hành động (người like, người gửi lời mời kết bạn, v.v.)
    @ManyToOne
    @JoinColumn(name = "actor_id ", nullable = false)
    private User actor;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "reference_id")
    private Integer referenceId;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt = new Date();
}

