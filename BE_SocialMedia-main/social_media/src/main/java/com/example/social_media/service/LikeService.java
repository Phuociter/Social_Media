package com.example.social_media.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.social_media.entity.Comment;
import com.example.social_media.entity.Like;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.User;
import com.example.social_media.repository.CommentRepository;
import com.example.social_media.repository.LikeRepository;
import com.example.social_media.repository.PostRepository;
import com.example.social_media.repository.UserRepository;

@Service
public class LikeService {
    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    public void toggleLike(Integer userId, Integer postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Like existingLike = likeRepository.findByPostIdAndUserId(postId, userId);

        if (existingLike != null) {
            likeRepository.delete(existingLike); // Bỏ like
            post.setLikeCount(post.getLikeCount() - 1);
            post.getLikes().remove(existingLike);
        } else {
            Like newLike = new Like();
            newLike.setUser(user);
            newLike.setPost(post);
            newLike.setTimestamp(new Date());
            likeRepository.save(newLike); // Thêm like
            post.setLikeCount(post.getLikeCount() + 1);
            post.getLikes().add(newLike);
        }

        postRepository.save(post);
    }

    public void toggleLikeComment(Integer userId, Integer commentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Post post = postRepository.findByPostId(likeRepository.findPostIdByCommentId(commentId));

        Like existingLike = likeRepository.findBycommentIdAndUserId(commentId, userId);

        if (existingLike != null) {
            likeRepository.delete(existingLike); // Bỏ like
            post.setLikeCount(post.getLikeCount() - 1);
            post.getLikes().remove(existingLike);
        } else {
            Like newLike = new Like();
            newLike.setUser(user);
            newLike.setComment(comment);
            newLike.setTimestamp(new Date());
            likeRepository.save(newLike); // Thêm like
            post.setLikeCount(post.getLikeCount() + 1);
            post.getLikes().add(newLike);
        }

        postRepository.save(post);
    }

    private void updateLikeCount(Integer postId, Integer delta) {
        if (postId != null) {
            postRepository.updateLikeCount(postId, delta);
        }
    }
    public Integer getLastLikeIdByUser(Integer userId) {
        Like lastLike = likeRepository.findTopByUser_UserIdOrderByLikeIdDesc(userId);
        return lastLike != null ? lastLike.getLikeId() : null;
    }

    public Integer getPostIdByLikeId(Integer likeId) {
        return likeRepository.findPostIdByLikeId(likeId);
    }

    public Integer getCommentIdByLikeId(Integer likeId) {
        return likeRepository.findCommentIdByLikeId(likeId);
    }
}
