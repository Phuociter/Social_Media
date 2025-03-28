package com.example.social_media.repository;

import com.example.social_media.entity.Friendship;  
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;


public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    
    @Query("SELECT f FROM Friendship f WHERE f.user1.userId = :userId OR f.user2.userId = :userId")
    List<Friendship> findFriendsByUserID(@Param("userId") Integer userId);
    
    // Tìm theo cả 2 thứ tự (vì mối quan hệ bạn bè không có thứ tự cụ thể)
    Optional<Friendship> findByUser1UserIdAndUser2UserId(Integer user1Id, Integer user2Id);
}
