package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notificationId;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @Column(length = 50, nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    // MỚI: Tham chiếu đối tượng gây ra thông báo (post, comment, user, ...)
    private Integer targetId;

    @Column(length = 50)
    private String targetType;

    @Column(nullable = false)
    private Boolean isRead = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();
}


