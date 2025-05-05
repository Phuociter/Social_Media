package com.example.social_media.service;

import com.example.social_media.entity.FriendRequest;
import com.example.social_media.entity.Friendship;

import com.example.social_media.entity.User;
import com.example.social_media.repository.FriendRequestRepository;
import com.example.social_media.repository.FriendshipRepository;
import com.example.social_media.repository.FriendSuggestionRepository;
import com.example.social_media.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
public class FriendService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;
    
    // Tiêm repository cho friend suggestion
    @Autowired
    private FriendSuggestionRepository friendSuggestionRepository;

    // Hàm gửi lời mời kết bạn
    public void sendFriendRequest(Integer senderId, Integer receiverId) {
        // Lấy đối tượng User tương ứng từ senderId và receiverId để thực hiện kiểm tra
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("khong tim thay nguoi gui"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("khong tim thay nguoi nhan"));


        // Kiểm tra xem đã có lời mời kết bạn chưa
        Optional<FriendRequest> existingRequest = friendRequestRepository.findBySenderAndReceiver(sender, receiver);
        if (existingRequest.isPresent()) {
            throw new RuntimeException("Loi moi da duoc gui hoac hai ban la ban be.");

        }

        // Tạo lời mời kết bạn mới
        FriendRequest request = new FriendRequest();
        request.setSender(sender);                  // Gán đối tượng User
        request.setReceiver(receiver);              // Gán đối tượng User
        request.setStatus(FriendRequest.Status.pending); // Sử dụng enum (PENDING, ACCEPTED, REJECTED)

        // Lưu vào cơ sở dữ liệu
        friendRequestRepository.save(request);
    }

    // Hàm lấy danh sách lời mời kết bạn chờ duyệt
    public List<FriendRequest> getPendingRequests(Integer receiverId) {
        return friendRequestRepository.findByReceiverUserIdAndStatus(receiverId, FriendRequest.Status.pending);
    }

        //hàm lấy danh sách lời mời đã chấp nhận//////////////////////////////////////////////
    public List<FriendRequest> getRequests(Integer receiverId) {
        return friendRequestRepository.findByReceiverUserId(receiverId);
    }


    // Hàm chấp nhận lời mời kết bạn
    public void acceptFriendRequest(Integer requestId) {
        // Tìm lời mời kết bạn theo requestId
        FriendRequest request = friendRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("khong tim thay loi moi."));


        // Cập nhật trạng thái thành ACCEPTED
        request.setStatus(FriendRequest.Status.accepted);
        friendRequestRepository.save(request);

        // Tạo đối tượng Friendship dựa trên sender và receiver (là đối tượng User)
        Friendship friendship = new Friendship();
        friendship.setUser1(request.getSender());
        friendship.setUser2(request.getReceiver());
        friendshipRepository.save(friendship);
    }

    // Hàm hủy kết bạn (unfriend)
    public void unfriend(Integer userId1, Integer userId2) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1UserIdAndUser2UserId(userId1, userId2);
        if (!friendshipOpt.isPresent()) {
            friendshipOpt = friendshipRepository.findByUser1UserIdAndUser2UserId(userId2, userId1);
        }
        if (friendshipOpt.isPresent()){
            friendshipRepository.delete(friendshipOpt.get());
        } else {
            throw new RuntimeException("Hai người không phải là bạn bè.");
        }
    }

    // Hàm lấy danh sách bạn bè
    public List<Friendship> getFriendList(Integer userId) {
        return friendshipRepository.findFriendsByUserID(userId);
    }
    
    public List<User> getFriendSuggestions(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return friendSuggestionRepository.findRandomUser_id(pageable);
    }

    public Optional<Friendship> isFriend(Integer userId1, Integer userId2) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1UserIdAndUser2UserId(userId1, userId2);
        if (!friendshipOpt.isPresent()) {
            friendshipOpt = friendshipRepository.findByUser1UserIdAndUser2UserId(userId2, userId1);
        }
        return friendshipOpt;
    }

//Từ chối lời mời
    public void denyFriendRequest(Integer userId1, Integer userId2) {
        Optional<FriendRequest> requestOpt = friendRequestRepository.findBySenderUserIdAndReceiverUserId(userId1, userId2);

        if (!requestOpt.isPresent()) {
            requestOpt = friendRequestRepository.findBySenderUserIdAndReceiverUserId(userId2, userId1);
        }

        if (requestOpt.isPresent()) {
            friendRequestRepository.delete(requestOpt.get());
        } else {
            throw new RuntimeException("Không tìm thấy lời mời kết bạn để từ chối.");
        }
    }
}
