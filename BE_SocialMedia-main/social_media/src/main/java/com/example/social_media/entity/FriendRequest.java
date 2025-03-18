package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "friend_request")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RequestID") // tên cột trong DB
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name = "SenderID", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "ReceiverID", nullable = false)
    private User receiver;

    @Column(name = "request_time", nullable = false, updatable = false, 
            columnDefinition = "DATETIME(6) DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime requestTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }
}
