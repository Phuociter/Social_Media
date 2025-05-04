package com.example.social_media.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.social_media.entity.Comment;
import com.example.social_media.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getCommentsWithLikes(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getCommentsWithLikesByPostId(postId));
    }

    @PostMapping("/add")
    public ResponseEntity<Comment> addComment(@RequestParam Integer postId,
            @RequestParam Integer userId,
            @RequestParam String comment) {
        return ResponseEntity.ok(commentService.addComment(postId, userId, comment));
    }

    // thêm ở đây
    @GetMapping("/userid/{commentId}")
    public ResponseEntity<Integer> getUserIdByCommentId(@PathVariable Integer commentId) {
        Comment comment = commentService.getCommentById(commentId);  // Lấy comment qua commentId
        Integer userId = comment.getUser().getUserId();  // Truy cập vào userId từ User
        return ResponseEntity.ok(userId);  // Trả về userId
    }

    // Hàm lấy commentId mới nhất theo userId
    @GetMapping("/latest/{userId}")
    public ResponseEntity<Integer> getLatestCommentIdByUserId(@PathVariable Integer userId) {
        Comment latestComment = commentService.getLatestCommentByUserId(userId);
        if (latestComment != null) {
            return ResponseEntity.ok(latestComment.getCommentId());  // Trả về commentId của bình luận mới nhất
        } else {
            return ResponseEntity.notFound().build();  // Nếu không tìm thấy bình luận nào, trả về 404
        }
    }

}
