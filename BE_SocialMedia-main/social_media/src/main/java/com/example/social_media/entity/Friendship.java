package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "friendship")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer friendshipId;

    @ManyToOne
    @JoinColumn(name = "UserID1", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "UserID2", nullable = false)
    private User user2;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();

    // MỚI: Thời gian mối quan hệ được chấp nhận
    @Temporal(TemporalType.TIMESTAMP)
    private Date acceptedAt;
}
