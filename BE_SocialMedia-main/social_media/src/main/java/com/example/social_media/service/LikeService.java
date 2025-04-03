package com.example.social_media.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.social_media.entity.Like;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.User;
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
    // @Transactional
    // public Map<String, Object> handleLike(Integer postId, Integer commentId,
    // Integer userId) {
    // // Chỉ like hoặc comment
    // if (postId != null && commentId != null) {
    // throw new IllegalArgumentException("Không thể like đồng thời cả post và
    // comment!");
    // }

    // User user = userRepository.findById(userId)
    // .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

    // Post post = postRepository.findById(postId)
    // .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

    // // Kiểm tra like hiện có
    // Like existingLike = postId != null
    // ? likeRepository.findByPostIdAndUserId(postId, userId)
    // : likeRepository.findBycommentIdAndUserId(commentId, userId);

    // if (existingLike != null) {
    // // Unlike: Xóa bản ghi
    // likeRepository.delete(existingLike);
    // updateLikeCount(postId, -1);
    // return Map.of(
    // "success", true,
    // "action", "unliked",
    // "newCount", post.getLikeCount());
    // } else {
    // // Like
    // Like newLike = new Like();
    // newLike.setPost(post);
    // newLike.setUser(user);
    // newLike.setTimestamp(new Date());
    // likeRepository.save(newLike);

    // updateLikeCount(postId, 1);
    // return Map.of(
    // "success", true,
    // "action", "liked",
    // "newCount", post.getLikeCount());
    // }

    // }

    private void updateLikeCount(Integer postId, Integer delta) {
        if (postId != null) {
            postRepository.updateLikeCount(postId, delta);
        }
    }
}