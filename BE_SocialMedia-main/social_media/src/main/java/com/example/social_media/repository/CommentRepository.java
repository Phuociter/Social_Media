package com.example.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.social_media.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPost_PostId(Integer postId);

    // Lấy tất cả cmt kèm likes
    @Query("SELECT DISTINCT c FROM Comment c LEFT JOIN FETCH c.likes WHERE c.post.postId = :postId")
    List<Comment> findAllCommentsWithLikes(Integer postId);
}
