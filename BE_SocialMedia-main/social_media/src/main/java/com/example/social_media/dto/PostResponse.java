package com.example.social_media.dto;

import java.util.Date;

import com.example.social_media.entity.Post;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Integer postId;
    private String content;
    private String mediaURL;
    private Integer likeCount;
    private Integer commentCount;
    private Date timestamp;

    public static PostResponse fromEntity(Post post) {
        return new PostResponse(
                post.getPostId(),
                post.getContent(),
                post.getMediaURL(),
                post.getLikeCount(),
                post.getCommentCount(),
                post.getTimestamp());
    }
}
