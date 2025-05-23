package com.example.social_media.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.social_media.entity.Post;
import com.example.social_media.repository.PostRepository;
import com.example.social_media.service.PostService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // @GetMapping("/{postId}")
    // public List<Post> getPostsByPostId(@PathVariable Integer postId) {
    //     return postService.getPostsByPostId(postId);
    // }

    @PostMapping("/{postId}/update")
    public ResponseEntity<Post> updatePost(@PathVariable Integer postId, @RequestBody Post post) {
        Post updatedPost = postService.updatePost(postId, post);
        return ResponseEntity.ok(updatedPost);
    }  
    
    @Autowired
    private PostRepository postRepository;

    @PostMapping("/posts/create")
    public ResponseEntity<Post> createPost(
            @RequestParam("userid") Integer userId,
            @RequestParam("content") String content,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile) throws IOException {
        Post post = postService.createPost(userId, content, mediaFile);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts/get/{id}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable Integer id) {
        List<Post> posts = postService.getAllPostsByUser(id);
        return ResponseEntity.ok(posts);
    }

    // return ResponseEntity.ok(posts);
    // }

    // @GetMapping("/posts")
    // public ResponseEntity<List<Post>> getSimpleRandomPosts(
    // @RequestParam(defaultValue = "5") int count,
    // @RequestParam(value = "userid", required = false) Integer userId) {
    // return ResponseEntity.ok(postService.getRandomPosts(count, userId));
    // }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getSimpleRandomPosts(
            @RequestParam(defaultValue = "5") int count) {
        return ResponseEntity.ok(postService.getRandomPosts(count));
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable Integer postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/posts/delete/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Integer postId) {

        postService.deletePost(postId);
        return ResponseEntity.ok().body("Xóa bài viết thành công");

    }

    @PutMapping("/posts/update/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable("postId") Integer postId,
            @RequestParam("description") String description,
            @RequestPart(value = "media", required = false) MultipartFile mediaFile,
            @RequestParam(value = "removeMedia", required = false) boolean removeMedia) throws IOException {
        return ResponseEntity.ok(postService.updatePost(postId, description, mediaFile, removeMedia));
    }

}
