package com.example.social_media.controller;

import com.example.social_media.entity.Notification;
import com.example.social_media.service.NotificationService;
import com.example.social_media.dto.NotificationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;



@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    
    @Autowired
    private NotificationService notificationService;

    // Lấy danh sách notification của user hiện tại, kèm count unread
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getNotifications(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Notification> notifications = notificationService.getNotifications(userId, page, size);
        long unreadCount = notificationService.getUnreadCount(userId);
    
        Map<String, Object> response = new HashMap<>();
        response.put("notifications", notifications.getContent());
        response.put("unreadCount", unreadCount);
        return ResponseEntity.ok(response);
    }
    
//đánh dấu tất cả thông báo là đã đọc cho một người dùng nhất định
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Integer userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }
    

    //  * Đếm số thông báo chưa đọc cho một người dùng nhất định
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> countUnread(@PathVariable Integer userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    // tạo thong báo mới
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody NotificationRequest request
    ) {
        Notification saved = notificationService.createNotification(
                request.getActorId(),
                request.getUserId(),
                request.getType(),
                request.getReferenceId()          // <-- dùng đúng referenceId
        );
        return ResponseEntity
                   .status(HttpStatus.CREATED)
                   .body(saved);
    }

    //  * xóa thông báo
    @DeleteMapping("/delete/{/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Integer notificationId,
            @RequestParam Integer userId) {

        notificationService.deleteNotification(notificationId, userId);
        return ResponseEntity.noContent().build();
    }
}
