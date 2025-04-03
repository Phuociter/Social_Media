package com.example.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.social_media.entity.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {
    @Query("SELECT p FROM Post p WHERE p.user.userId = :userId")
    List<Post> findByUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + :delta WHERE p.postId = :postId")
    void updateLikeCount(@Param("postId") Integer postId, @Param("delta") int delta);

    @Query("SELECT p.likeCount FROM Post p WHERE p.postId = :postId")
    int getLikeCount(@Param("postId") Integer postId);

}
