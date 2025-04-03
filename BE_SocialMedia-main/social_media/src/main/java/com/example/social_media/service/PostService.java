package com.example.social_media.service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.social_media.dto.PostResponse;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.User;
import com.example.social_media.repository.PostRepository;
import com.example.social_media.repository.UserRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Post createPost(Integer userId, String content, MultipartFile file) throws IOException {
        // 1. Kiểm tra xem user có tồn tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);

        if (file != null) {
            String mediaUrl = fileStorageService.saveFile(file);
            post.setMediaURL(mediaUrl);
            String mediaType = file.getContentType().startsWith("image") ? "image" : "video";
            post.setMediaType(mediaType);
        }

        post.setTimestamp(new Date());

        // 4. Lưu vào database
        return postRepository.save(post);
    }

    public List<PostResponse> getAllPostsByUser(Integer userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        return posts.stream().map(PostResponse::fromEntity).collect(Collectors.toList());
    }
}
