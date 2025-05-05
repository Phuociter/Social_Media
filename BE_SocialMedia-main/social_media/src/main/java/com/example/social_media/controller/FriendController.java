package com.example.social_media.controller;

import com.example.social_media.entity.FriendRequest;
import com.example.social_media.entity.Friendship;
import com.example.social_media.service.FriendService;
import com.example.social_media.entity.User;
import com.example.social_media.dto.FriendshipDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendService friendService;

    private FriendshipDTO friendshipDTO;

    @GetMapping("/suggestions")
    public ResponseEntity<List<User>> getFriendSuggestions(@RequestParam Integer userId, @RequestParam(defaultValue = "10") int limit) {
        List<User> suggestions = friendService.getFriendSuggestions(limit);

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
        return ResponseEntity.ok("loi moi da duoc chap nhan.");

    }

    // Hủy kết bạn
    @DeleteMapping("/unfriend")
    public ResponseEntity<?> unfriend(@RequestParam Integer userId1, @RequestParam Integer userId2) {
        friendService.unfriend(userId1, userId2);
        return ResponseEntity.ok("da huy ket ban.");

    }


    // Lấy danh sách bạn bè
    @GetMapping("/list")
    public ResponseEntity<List<Friendship>> getFriendList(@RequestParam Integer userId) {
        List<Friendship> friendList = friendService.getFriendList(userId);
        return ResponseEntity.ok(friendList);
    }

    @GetMapping("/isFriend")
    public ResponseEntity<String> checkIsFriend(@RequestParam Integer userId1, @RequestParam Integer userId2) {

        Optional<Friendship> friendship = friendService.isFriend(userId1, userId2);

        if (friendship.isPresent()) {
            return ResponseEntity.ok("Hai nguoi la ban be.");
        } else {
            return ResponseEntity.ok("hai nguoi khong phai la ban be.");
        }
    }

    @GetMapping("/getFriendStatus")
    public ResponseEntity<FriendshipDTO> checkFriendshipStatus(
            @RequestParam Integer userId1,
            @RequestParam Integer userId2) {

        // 1. Kiểm tra nếu userId1 gửi lời mời cho userId2
        Optional<FriendRequest> fromUser1ToUser2 = friendService.getPendingRequests(userId2)
                .stream()
                .filter(req -> req.getSender().getUserId().equals(userId1))
                .findFirst();

        if (fromUser1ToUser2.isPresent()) {
            FriendRequest request = fromUser1ToUser2.get();
            return ResponseEntity.ok(new FriendshipDTO(
                    "pending",
                    request.getSender().getUserId(),
                    request.getReceiver().getUserId(),
                    request.getRequestId()
            ));
        }

        // 2. Kiểm tra nếu userId2 gửi lời mời cho userId1
        Optional<FriendRequest> fromUser2ToUser1 = friendService.getPendingRequests(userId1)
                .stream()
                .filter(req -> req.getSender().getUserId().equals(userId2))
                .findFirst();

        if (fromUser2ToUser1.isPresent()) {
            FriendRequest request = fromUser2ToUser1.get();
            return ResponseEntity.ok(new FriendshipDTO(
                    "pending",
                    request.getSender().getUserId(),
                    request.getReceiver().getUserId(),
                    request.getRequestId()
            ));
        }

        // 3. Kiểm tra nếu đã là bạn
        Optional<Friendship> friendship = friendService.isFriend(userId1, userId2);
        if (friendship.isPresent()) {
            return ResponseEntity.ok(new FriendshipDTO(
                    "friends",
                    userId1,
                    userId2,
                    null
            ));
        }

        // 4. Không phải bạn, cũng không có lời mời
        return ResponseEntity.ok(new FriendshipDTO(
                "not_friends",
                userId1,
                userId2,
                null
        ));
    }

        // hàm cần thiết lấy ra requestId cuối cùng của người nhận
    @GetMapping("/requests/last-request-id/{senderId}&{receiverId}")
    public ResponseEntity<?> getLastRequestId(@PathVariable  Integer senderId,
                                              @PathVariable  Integer receiverId) {
        List<FriendRequest> requests = friendService.getRequests(receiverId);

        System.out.println("Tất cả request của receiverId " + receiverId + ":");
        for (FriendRequest req : requests) {
            System.out.println("SenderId: " + req.getSender().getUserId() + ", RequestId: " + req.getRequestId());
        }

        Optional<Integer> requestIdOpt = requests.stream()
        .filter(req -> req.getSender().getUserId().equals(senderId)) // Lọc theo senderId
        .map(FriendRequest::getRequestId) // Lấy requestId
        .findFirst();

        if (requestIdOpt.isPresent()) {
            return ResponseEntity.ok(requestIdOpt.get());
        } else {
            return ResponseEntity.ok("Không tìm thấy lời mời phù hợp.");
        }
    }

}

