package com.example.social_media.service;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.social_media.entity.Post;
import com.example.social_media.entity.User;
import com.example.social_media.repository.PostRepository;
import com.example.social_media.repository.UserRepository;

import jakarta.transaction.Transactional;

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

    public List<Post> getAllPostsByUser(Integer userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        return posts;
    }

    // Hiện bài chưa like
    // public List<Post> getRandomPosts(int count, Integer userId) {
    // // 1. Lấy danh sách post chưa like (đã fetch likes)
    // List<Post> unlikedPosts = userId != null
    // ? postRepository.findUnlikedPostsWithLikesByUser(userId)
    // : postRepository.findAllWithLikes(); // Lấy tất cả post kèm likes

    // // 2. Xáo trộn danh sách
    // Collections.shuffle(unlikedPosts);

    // // 3. Giới hạn số lượng kết quả
    // return unlikedPosts.stream()
    // .limit(count)
    // .collect(Collectors.toList());
    // }

    // hiện hết
    public List<Post> getRandomPosts(int count) {
        // 1. Lấy tất cả post kèm likes
        List<Post> allPosts = postRepository.findAllWithLikes();

        // 2. Xáo trộn ngẫu nhiên
        Collections.shuffle(allPosts);

        // 3. Trả về số lượng mong muốn (có đủ thông tin likes)
        return allPosts.stream()
                .limit(count)
                .collect(Collectors.toList());
    }

    // Delete
    @Transactional
    public void deletePost(Integer postId) {
        // // Kiểm tra tồn tại trước khi xóa
        // if (!postRepository.existsById(postId)) {
        // throw new RuntimeException("Post đã bị xóa hoặc không tồn tại");
        // }

        // Xóa bằng query trực tiếp để tránh cache
        postRepository.deleteById(postId);
        postRepository.flush();
    }

    // Chỉnh sửa post

    public Post updatePost(Integer postId, String content, MultipartFile mediaFile, boolean removeMedia)
            throws IOException {
        Post post = postRepository.findByPostId(postId);
        post.setContent(content);

        // Xóa media cũ nếu cần
        if (removeMedia && post.getMediaURL() != null) {
            File oldFile = new File(post.getMediaURL());
            if (oldFile.exists())
                oldFile.delete();
            post.setMediaURL(null);
            post.setMediaType(null);
        }

        // Nếu có file mới

        if (mediaFile != null && !mediaFile.isEmpty()) {
            String mediaUrl = fileStorageService.saveFile(mediaFile);
            post.setMediaURL(mediaUrl);
            String mediaType = mediaFile.getContentType().startsWith("image") ? "image" : "video";
            post.setMediaType(mediaType);

        }

        post.setTimestamp(new Date());
        return postRepository.save(post);
    }
}
