package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentId;

    @ManyToOne
    @JoinColumn(name = "PostID", nullable = false)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // MỚI: Cờ đánh dấu đã chỉnh sửa (tuỳ chọn)
    @Column(nullable = false)
    private Boolean isEdited = false;

    // MỚI: Thời gian chỉnh sửa cuối (tuỳ chọn)
    @Temporal(TemporalType.TIMESTAMP)
    private Date editTimestamp;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();
}
