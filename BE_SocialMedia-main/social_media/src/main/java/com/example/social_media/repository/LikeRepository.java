package com.example.social_media.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.social_media.entity.Like;

public interface LikeRepository extends JpaRepository<Like, Integer> {

    // Tìm like của postId và userId
    @Query("SELECT l FROM Like l WHERE l.post.postId = :postId AND l.user.userId = :userId")
    Like findByPostIdAndUserId(@Param("postId") Integer postId, @Param("userId") Integer userId);

    // Tìm like của commentId và userId
    @Query("SELECT l FROM Like l WHERE l.comment.commentId = :commentId AND l.user.userId = :userId")
    Like findBycommentIdAndUserId(@Param("commentId") Integer commentId, @Param("userId") Integer userId);

    @Query("SELECT c.post.postId FROM Comment c WHERE c.commentId = :commentId")
    Integer findPostIdByCommentId(@Param("commentId") Integer commentId);

    Like findTopByUser_UserIdOrderByLikeIdDesc(Integer userId);

    // lấy postId theo likeId
    @Query("SELECT l.post.postId FROM Like l WHERE l.likeId = :likeId AND l.post IS NOT NULL")
    Integer findPostIdByLikeId(@Param("likeId") Integer likeId);

    // lấy commentID theo likeId
    @Query("SELECT l.comment.commentId FROM Like l WHERE l.likeId = :likeId AND l.comment IS NOT NULL")
    Integer findCommentIdByLikeId(@Param("likeId") Integer likeId);

    //
}
