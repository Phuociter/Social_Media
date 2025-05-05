package com.example.social_media.service;

import java.io.File;
import com.example.social_media.entity.Post.Status;
import java.io.IOException;
import java.util.ArrayList;
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

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public long countPosts() {
        return postRepository.count();
    }

    public List<Post> getPostsByStatus(Status status) {
        return postRepository.findByStatus(status);
    }

    // public List<Post> getPostsByPostId(Integer postId) {
    // return postRepository.findByPostId(postId);
    // }
    public Post getPostById(Integer postId) {
        return postRepository.findById(postId).orElse(null);
    }
    public Post blockPost(Integer postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post != null) {
            post.setStatus(Status.rejected);
            return postRepository.save(post);
        }
        return null;
    }

    public Post unblockPost(Integer postId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post != null) {
            post.setStatus(Status.approved);
            return postRepository.save(post);
        }
        return null;
    }

    public Post updatePost(Integer postId, Post post) {
        Post existingPost = postRepository.findById(postId).orElse(null);
        if (existingPost != null) {
            existingPost.setStatus(post.getStatus());
            existingPost.setContent(post.getContent());
            existingPost.setMediaType(post.getMediaType());
            existingPost.setMediaURL(post.getMediaURL());
            return postRepository.save(existingPost);
        }
        return null;
    }

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
        post.setMediaType("text");
        post.setTimestamp(new Date());

        // 4. Lưu vào database
        return postRepository.save(post);
    }

    public List<Post> getAllPostsByUser(Integer userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        return posts;
    }

    // hiện hết theo count
    public List<Post> getRandomPosts(int count) {
        // 1. Lấy tất cả post kèm likes
        List<Post> allPosts = postRepository.findAllWithLikes();

        // 2. Xáo trộn ngẫu nhiên
        Collections.shuffle(allPosts);

        // 3. Trả về số lượng mong muốn (có đủ thông tin likes)
        return allPosts.stream()
                // .limit(count)
                .collect(Collectors.toList());
    }

    // Lấy bài của bạn bè + người lạ, ưu tiên bạn bè
    public List<Post> getAllPostsWithPriority(Integer userId) {
        List<Object[]> rawResults = postRepository.findAllPostsWithPriority(userId);
        List<Post> posts = new ArrayList<>();

        for (Object[] row : rawResults) {
            Post post = (Post) row[0];
            posts.add(post);
        }

        return posts;
    }

    // Delete
    @Transactional
    public void deletePost(Integer postId) {

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
