package com.example.social_media.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.social_media.entity.Post;
import com.example.social_media.service.PostService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{postId}")
    public List<Post> getPostsByPostId(@PathVariable Integer postId) {
        return postService.getPostsByPostId(postId);
    }
}
