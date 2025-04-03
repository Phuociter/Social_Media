package com.example.social_media.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.social_media.dto.PostResponse;
import com.example.social_media.entity.Post;
import com.example.social_media.service.PostService;

@RestController
@RequestMapping("/api")
public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping("/posts/create")
    public ResponseEntity<Post> createPost(
            @RequestParam("userid") Integer userId,
            @RequestParam("content") String content,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile) throws IOException {
        Post post = postService.createPost(userId, content, mediaFile);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> getUserPosts(@RequestParam("userid") Integer userId) {
        List<PostResponse> posts = postService.getAllPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }
}
