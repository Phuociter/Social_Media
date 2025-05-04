package com.example.social_media.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.social_media.service.LikeService;

@RestController
@RequestMapping("/api")
public class LikeController {
    @Autowired
    private LikeService likeService;

    // @PostMapping("/posts/create")
    // public ResponseEntity<Post> createPost(
    // @RequestParam("userid") Integer userId,
    // @RequestParam("content") String content,
    // @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile)
    // throws IOException {
    // Post post = postService.createPost(userId, content, mediaFile);
    // return ResponseEntity.ok(post);
    // }

    @PostMapping("/likes")
    public ResponseEntity<?> handleLike(@RequestParam("userId") Integer userId,
            @RequestParam("postId") Integer postId) {
        likeService.toggleLike(userId, postId);
        return ResponseEntity.ok("Like/unlike thành công");
    }

    @PostMapping("/likes/comment")
    public ResponseEntity<?> handleLikeComment(@RequestParam("userId") Integer userId,
            @RequestParam("commentId") Integer commentId) {
        likeService.toggleLikeComment(userId, commentId);
        return ResponseEntity.ok("Like/unlike thành công");
    }
//thêm ơ đây///////////////////////////////////////////////////////////////
    @GetMapping("/likes/last/{userId}")
    public ResponseEntity<?> getLastLikeId(@PathVariable("userId") Integer userId) {
        Integer likeId = likeService.getLastLikeIdByUser(userId);
        if (likeId == null) {
            return ResponseEntity.ok("User chưa like bài nào.");
        }
        return ResponseEntity.ok(likeId);
    }


}
