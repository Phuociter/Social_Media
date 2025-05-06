package com.example.social_media.controller;

import java.util.Map;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.social_media.entity.User;
import com.example.social_media.dto.MonthPostDTO;
import com.example.social_media.dto.MonthUserDTO;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.Post.Status;
import com.example.social_media.entity.Role;
import com.example.social_media.service.UserService;
import com.example.social_media.service.PostService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép frontend truy cập
public class AdminController {

    // Khởi tạo UserService
    @Autowired
    private UserService userService;
    @Autowired
    private PostService postService;

    // Lấy thống kê số lượng người dùng, bài viết, bình luận
    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Long>> getStats() {
        java.util.Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userService.count());
        stats.put("totalPosts", postService.countPosts());
        stats.put("totalPostsIsTatusReject", postService.countPostsisReject());
        stats.put("totalPostsIsTatusApprove", postService.countPostsisApprove());
        stats.put("totalPostsIsTatusPending", postService.countPostsisPending());
        stats.put("totalUserIstatusAvtive", userService.countUsersbystatusisactive());
        stats.put("totalUserIstatusBlock", userService.countUsersbystatusisblock());

        // stats.put("totalComments", postService.countComments());
        return ResponseEntity.ok(stats);
    }
    
    // Lấy danh sách người dùng
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    // lấy danh sách bài viết theo năm
    @GetMapping("/chart/posts")
    public ResponseEntity<List<MonthPostDTO>> getPostChart(@RequestParam int year) {
        return ResponseEntity.ok(postService.getPostCountByMonth(year));
    }
    
    // Lấy danh sách bài viết
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/posts/{postId}/update")
    public ResponseEntity<String> updatePostStatus(@PathVariable Integer postId,
            @RequestBody Map<String, String> postData) {
        // Lấy trạng thái từ request body (trong dạng String)
        String statusStr = postData.get("status");
        System.out.println("Status: " + statusStr);
        // Kiểm tra nếu status hợp lệ
        if (statusStr == null || statusStr.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ");
        }

        // Chuyển đổi String thành Enum Status
        Status status;
        try {
            status = Status.valueOf(statusStr.toLowerCase()); // Chuyển thành enum
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ");
        }

        // Tìm bài viết theo postId
        Post existingPost = postService.getPostById(postId);

        if (existingPost != null) {
            // Cập nhật trạng thái bài viết bằng enum Status
            existingPost.setStatus(status); // Đây là kiểu Post.Status, không phải String

            // Lưu lại bài viết đã cập nhật
            postService.updatePost(existingPost.getPostId(), existingPost);

            return ResponseEntity.ok("Cập nhật trạng thái bài viết thành công");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bài viết không tồn tại");
        }
    }

    // khóa bai viết
    @PutMapping("/posts/{id}/block")
    public String blockPost(@PathVariable Integer id) {
        Post post = postService.getPostById(id);
        if (post != null) {
            post.setStatus(post.getStatus()); // Giả sử 0 là trạng thái bị khóa
            postService.updatePost(post.getPostId(), post);
            return "Post blocked successfully";
        } else {
            return "Post not found";
        }
    }

    // Cập nhật role user với user.role là enum, và lấy dữ liệu được truyền về từ FE
    @PutMapping("/users/{userId}/updateRole")
    public ResponseEntity<String> updateUserRole(@PathVariable Integer userId,
            @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        System.out.println(roleStr);
        if (roleStr == null || roleStr.isEmpty()) {
            return ResponseEntity.badRequest().body("Role không hợp lệ");
        }

        try {
            Role role = Role.valueOf(roleStr.toLowerCase()); // Chuyển đổi String thành Enum
            User user = userService.getUserById(userId).orElse(null);
            if (user != null) {
                user.setRole(role);
                userService.updateUser(user.getUserId());
                return ResponseEntity.ok("Cập nhật role người dùng thành công");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Role không hợp lệ");
        }
    }

    @GetMapping("/chart/users")
    public ResponseEntity<List<MonthUserDTO>> getUserChart(@RequestParam int year) {
        return ResponseEntity.ok(userService.getUserCountByMonth(year));
    }

    // khóa tài khoản người dùng
    @PutMapping("/users/{userId}/block")
    public ResponseEntity<String> changeUserStatus(@PathVariable Integer userId,
            @RequestBody Map<String, Object> body) {
        Object statusObj = body.get("status");
        System.out.println("Status: " + statusObj);
        if (statusObj instanceof Integer status) {
            User user = userService.getUserById(userId).orElse(null);
            if (user != null) {
                user.setStatus(status);
                userService.updateUser(user.getUserId());
                return ResponseEntity.ok("User status updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        }
        return ResponseEntity.badRequest().body("Invalid status data");
    }

}