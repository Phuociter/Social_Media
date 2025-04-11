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
    

}
