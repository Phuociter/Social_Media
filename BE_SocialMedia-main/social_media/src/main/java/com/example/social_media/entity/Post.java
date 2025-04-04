package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PostID")
    private Integer postId;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 20)
    private String mediaType;

    @Column(length = 255)
    private String mediaURL;

    @Enumerated(EnumType.STRING)
    @Column(length = 8, nullable = false)
    private Status status = Status.approved;

    @Column(nullable = false)
    private Integer likeCount = 0;

    @Column(nullable = false)
    private Integer commentCount = 0;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();

    public enum Status {
        pending, approved, rejected
    }
}
