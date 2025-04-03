package com.example.social_media.dto;

import java.util.Date;

import lombok.Data;

@Data
public class CommentDTO {
    private Integer commentId;
    private Integer postId;
    private Integer userId;
    private String content;
    private Date timestamp;
}
