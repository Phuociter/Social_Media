package com.example.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.social_media.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPost_PostId(Integer postId);
}
