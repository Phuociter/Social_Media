package com.example.social_media.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.social_media.entity.Post;
import com.example.social_media.entity.Post.Status;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByStatus(Status status); 
    List<Post> findByContentContaining(String content);
    List<Post> findByPostId(Integer postId);

    
}
