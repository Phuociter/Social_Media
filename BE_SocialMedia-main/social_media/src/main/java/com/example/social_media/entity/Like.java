package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "likes")
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LikeID")
    private Integer likeId;

    @ManyToOne
    @JoinColumn(name = "PostID")
    private Post post;


    @ManyToOne
    @JoinColumn(name = "CommentID")
    private Comment comment;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();
}
