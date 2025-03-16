package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "friend_request")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name = "SenderID", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "ReceiverID", nullable = false)
    private User receiver;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date requestTime = new Date();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Status status = Status.PENDING;

    // MỚI: Lời nhắn kèm khi gửi yêu cầu (tuỳ chọn)
    @Column(length = 255)
    private String requestMessage;

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }
}

