package com.example.social_media.controller;

import com.example.social_media.entity.FriendRequest;
import com.example.social_media.entity.Friendship;
import com.example.social_media.service.FriendService;
import com.example.social_media.entity.FriendSuggestion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    @GetMapping("/suggestions")
    public ResponseEntity<List<FriendSuggestion>> getFriendSuggestions(
            @RequestParam Integer userId,
            @RequestParam(defaultValue = "5") int limit) {
        List<FriendSuggestion> suggestions = friendService.getFriendSuggestions(limit);
        return ResponseEntity.ok(suggestions);
    }

    // Gửi lời mời kết bạn
    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(@RequestParam Integer senderId,
                                               @RequestParam Integer receiverId) {
        friendService.sendFriendRequest(senderId, receiverId);
        return ResponseEntity.ok("Lời mời đã được gửi.");
    }

    // Lấy danh sách lời mời chờ duyệt
    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequest>> getPendingRequests(@RequestParam Integer receiverId) {
        List<FriendRequest> requests = friendService.getPendingRequests(receiverId);
        return ResponseEntity.ok(requests);
    }

    // Chấp nhận lời mời kết bạn
    @PutMapping("/request/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@PathVariable Integer requestId) {
        friendService.acceptFriendRequest(requestId);
        return ResponseEntity.ok("Lời mời đã được chấp nhận.");
    }

    // Hủy kết bạn
    @DeleteMapping("/unfriend")
    public ResponseEntity<?> unfriend(@RequestParam Integer userId1, @RequestParam Integer userId2) {
        friendService.unfriend(userId1, userId2);
        return ResponseEntity.ok("Đã hủy kết bạn.");
    }

    // Lấy danh sách bạn bè
    @GetMapping("/list")
    public ResponseEntity<List<Friendship>> getFriendList(@RequestParam Integer userId) {
        List<Friendship> friendList = friendService.getFriendList(userId);
        return ResponseEntity.ok(friendList);
    }
}

