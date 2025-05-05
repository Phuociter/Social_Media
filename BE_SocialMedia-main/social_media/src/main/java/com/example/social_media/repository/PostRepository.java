package com.example.social_media.repository;

import java.util.List;
import com.example.social_media.entity.Post.Status;

import com.example.social_media.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.social_media.dto.MonthPostDTO;
import com.example.social_media.entity.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByStatus(Status status);

    List<Post> findByContentContaining(String content);

    // Tim kiem bai dang
    List<Post> findByContentContainingIgnoreCase(String keyword);

    @Query("SELECT DISTINCT  p FROM Post p LEFT JOIN FETCH p.likes WHERE p.user.userId = :userId")
    List<Post> findByUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + :delta WHERE p.postId = :postId")
    void updateLikeCount(@Param("postId") Integer postId, @Param("delta") int delta);

    @Query("SELECT p.likeCount FROM Post p WHERE p.postId = :postId")
    int getLikeCount(@Param("postId") Integer postId);

    // Lấy post chưa like + fetch luôn likes
    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.likes WHERE p NOT IN " +
            "(SELECT p2 FROM Post p2 JOIN p2.likes l WHERE l.user.userId = :userId)")
    List<Post> findUnlikedPostsWithLikesByUser(@Param("userId") Integer userId);

    // Lấy tất cả post kèm likes
    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.likes")
    List<Post> findAllWithLikes();

    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.likes WHERE p.postId = :postId")
    Post findByPostId(@Param("postId") Integer postId);

    List<Post> findByUser(User user);

    // Lấy cả post bạn bè và người lạ, ưu tiên bạn bè
    @Query("""
                SELECT p,
                CASE WHEN p.user.userId IN (
                    SELECT f.user2.userId FROM Friendship f WHERE f.user1.userId = :userId
                    UNION
                    SELECT f.user1.userId FROM Friendship f WHERE f.user2.userId = :userId
                ) THEN 1 ELSE 2 END AS priority
                FROM Post p
                WHERE p.status!='rejected'
                ORDER BY priority ASC, p.timestamp DESC
            """)
    List<Object[]> findAllPostsWithPriority(@Param("userId") Integer userId);

    // Lấy số lượng bài viết theo tháng
    @Query("SELECT new com.example.social_media.dto.MonthPostDTO(MONTH(p.timestamp), COUNT(p)) " +
            "FROM Post p WHERE YEAR(p.timestamp) = :year GROUP BY MONTH(p.timestamp) ORDER BY MONTH(p.timestamp)")
    List<MonthPostDTO> countPostsByMonth(@Param("year") int year);
    
}
