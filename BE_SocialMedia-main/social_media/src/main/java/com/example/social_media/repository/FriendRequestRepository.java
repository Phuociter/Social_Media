package com.example.social_media.repository;

import com.example.social_media.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.social_media.entity.User;
import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    
    List<FriendRequest> findByReceiverUserIdAndStatus(Integer receiverUserId, FriendRequest.Status status);
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    
}



