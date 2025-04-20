package com.example.social_media.controller;

import java.util.HashMap;
import java.util.List;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.social_media.entity.User;
import com.example.social_media.entity.Post;
import com.example.social_media.service.UserService;
import com.example.social_media.service.PostService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép frontend truy cập
public class AdminController {
    
    //Khởi tạo UserService
    @Autowired
    private UserService userService;
    @Autowired
    private PostService postService;

    //Lấy thống kê số lượng người dùng, bài viết, bình luận
    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Long>> getStats() {
        java.util.Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userService.count());
        stats.put("totalPosts", postService.countPosts());
        // stats.put("totalComments", postService.countComments());
        return ResponseEntity.ok(stats);
    }
    //Lấy danh sách người dùng
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    //Lấy danh sách bài viết
    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }       
    //Cập nhật người dùng
    @PutMapping("/users/{id}")
    public String updateUser(@PathVariable Integer id, @RequestBody User user) {
        userService.updateUser(id, user);
        return "User updated successfully";
    }
}