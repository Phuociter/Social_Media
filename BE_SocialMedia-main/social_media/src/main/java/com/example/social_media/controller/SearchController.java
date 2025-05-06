package com.example.social_media.controller;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.social_media.repository.PostRepository;
import com.example.social_media.repository.UserRepository;

import com.example.social_media.entity.User;
import com.example.social_media.entity.Post;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/search")
public class SearchController {
    @Autowired
    public PostRepository postRepository;

    @Autowired
    public UserRepository userRepository;
    @GetMapping("/SearchFor")
    public ResponseEntity<?> search(@RequestParam String keyword) {
        if (keyword.contains("@")) {
            Optional<User> userOpt = userRepository.findByEmailIgnoreCase(keyword);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // Ẩn mật khẩu
                user.setPassword(null);
                List<Post> posts = postRepository.findByUser(user);
                Map<String, Object> result = new HashMap<>();
                result.put("user", user);
                result.put("posts", posts);
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.ok(Map.of("message", "No user found with this email"));
            }
        }

        List<User> users = userRepository.findByUsernameContainingIgnoreCase(keyword);
        users.forEach(u -> u.setPassword(null));
        List<Post> posts = postRepository.searchByContentAndStatusNotRejected(keyword, Post.Status.rejected);
        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        response.put("posts", posts);
        return ResponseEntity.ok(response);
    }


}
