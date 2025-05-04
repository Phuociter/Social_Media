package com.example.social_media.service;

import com.example.social_media.entity.Notification;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.User;
import com.example.social_media.entity.Comment;
import com.example.social_media.repository.CommentRepository;
import com.example.social_media.repository.PostRepository;
import com.example.social_media.repository.UserRepository;
import com.example.social_media.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Date;
import java.time.ZoneId;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Inject thêm hai repository này
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    /**
     * Tạo một thông báo mới
     */

    public Notification createNotification(
            Integer actorId,
            Integer userId,
            String type,
            Integer referenceId  // bây giờ nhận referenceId thay vì content
    ) {
        User actor = userRepository.findById(actorId)
            .orElseThrow(() -> new RuntimeException("Actor not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setActor(actor);
        notification.setUser(user);
        notification.setType(type);
        notification.setReferenceId(referenceId);

        // Sinh nội dung dựa trên type
        String content;
        switch (type) {
            case "friend_request_received":
                content = String.format("%s đã gửi cho bạn lời mời kết bạn", actor.getUsername());
                break;

            case "friend_request_accepted":
                content = String.format("%s đã chấp nhận lời mời kết bạn của bạn", actor.getUsername());
                break;

            case "like_post":
                // Giả sử bạn có PostRepository
                Post post_like = postRepository.findById(referenceId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
                // Cắt gọn nội dung
                String snippet = post_like.getContent();
                if (snippet.length() > 30) snippet = snippet.substring(0, 30) + "…";
                content = String.format("%s đã thích bài viết của bạn: \"%s\"", actor.getUsername(), snippet);
                break;
            
            case "like_comment":
                Comment comment_like = commentRepository.findById(referenceId)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
                // Lấy nội dung comment
                String commentSnippet = comment_like.getContent();
                if (commentSnippet.length() > 30) commentSnippet = commentSnippet.substring(0, 30) + "…";
                content = String.format("%s đã thích bình luận của bạn: \"%s\"", actor.getUsername(), commentSnippet);
                break;
            
                
            case "comment_post":
                Comment comment_post = commentRepository.findById(referenceId)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
                String cmtSnip = comment_post.getContent();
                if (cmtSnip.length() > 30) cmtSnip = cmtSnip.substring(0, 30) + "…";
                content = String.format("%s đã bình luận trên bài viết của bạn: \"%s\"", actor.getUsername(), cmtSnip);
                break;

            case "new_post": {
                    // Lấy bài viết
                    Post new_post = postRepository.findById(referenceId)
                        .orElseThrow(() -> new RuntimeException("Post not found"));

                    String snippet_new_post = new_post.getContent();
                    if (snippet_new_post.length() > 30) snippet_new_post = snippet_new_post.substring(0, 30) + "…";
                    content = String.format("%s đã đăng một bài viết mới: \"%s\"",actor.getUsername(),snippet_new_post);
                    break;
                }

            case "share_post": {
                    Post sharedPost = postRepository.findById(referenceId)
                        .orElseThrow(() -> new RuntimeException("Post not found"));
                    String snippet_share = sharedPost.getContent();
                    if (snippet_share.length() > 30) snippet_share = snippet_share.substring(0, 30) + "…";
                    content = String.format("%s đã chia sẻ bài viết của bạn: \"%s\"", actor.getUsername(), snippet_share);
                    break;
            }
            default:
                throw new IllegalArgumentException("Unknown notification type: " + type);
        }
        notification.setContent(content);

        // Thời gian tạo
        notification.setCreatedAt(Date.from(
            LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()
        ));

        return notificationRepository.save(notification);
    }

    /**
     * Lấy danh sách thông báo theo user, phân trang và sắp xếp theo thời gian tạo giảm dần
     */
    public Page<Notification> getNotifications(Integer userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    /**
     * Đếm số lượng thông báo chưa đọc của user
     */
    public long getUnreadCount(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    /**
     * Đánh dấu một thông báo là đã đọc
     */
    public void markAsRead(Integer notificationId, Integer userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Not your notification");
        }

        if (notification.getContent() == null) {
            throw new RuntimeException("Notification content cannot be null");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Lấy chi tiết một thông báo (với quyền truy cập của user)
     */
    public Notification getNotificationById(Integer notificationId, Integer userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Not your notification");
        }
        return notification;
    }

    /**
     * Xóa một thông báo (với quyền truy cập của user)
     */
    public void deleteNotification(Integer notificationId, Integer userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Not your notification");
        }
        notificationRepository.delete(notification);
    }

    // void markAllAsRead(Integer userId);
    @Transactional
    public void markAllAsRead(Integer userId) {
        // User user = userRepository.findById(userId)
        //         .orElseThrow(() -> new RuntimeException("User not found"));
        notificationRepository.markAllAsRead(userId);
    }
    
}
