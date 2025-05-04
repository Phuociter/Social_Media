package com.example.social_media.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.social_media.entity.Comment;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.User;
import com.example.social_media.repository.CommentRepository;
import com.example.social_media.repository.PostRepository;
import com.example.social_media.repository.UserRepository;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Comment> getCommentsWithLikesByPostId(Integer postId) {
        return commentRepository.findAllCommentsWithLikes(postId);
    }

    public Comment addComment(Integer postId, Integer userId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết!"));
        Comment comment = new Comment(post, user, content);
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
        return commentRepository.save(comment);
    }
////thêm ở đây/////////////////////////////////////////////////////////////////////
    public Comment getCommentById(Integer commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    // Hàm lấy comment mới nhất của user theo userId
    public Comment getLatestCommentByUserId(Integer userId) {
        return commentRepository.findTopByUser_UserIdOrderByTimestampDesc(userId);  // Giả sử có phương thức tìm kiếm này trong repository
    }

    
}
