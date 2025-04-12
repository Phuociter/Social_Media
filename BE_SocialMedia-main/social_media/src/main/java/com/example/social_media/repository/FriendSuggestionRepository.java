package com.example.social_media.repository;

import com.example.social_media.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FriendSuggestionRepository extends JpaRepository<User, Integer> {
    
    @Query(value = "SELECT * FROM users ORDER BY RAND()", nativeQuery = true)
    List<User> findRandomUser_id(Pageable pageable);

    
    

}

