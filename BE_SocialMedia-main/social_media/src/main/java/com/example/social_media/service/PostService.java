package com.example.social_media.service;

import com.example.social_media.entity.Post;
import com.example.social_media.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.social_media.entity.Post.Status;
import java.util.List;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    public long countPosts() {
        return postRepository.count();
    }
    public List<Post> getPostsByStatus(Status status) {
        return postRepository.findByStatus(status);
    }

    public List<Post> getPostsByPostId(Integer postId) {
        return postRepository.findByPostId(postId);
    }
}
