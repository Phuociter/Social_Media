package com.example.social_media.repository;

import com.example.social_media.entity.FriendSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FriendSuggestionRepository extends JpaRepository<FriendSuggestion, Integer> {
    
    @Query(value = "SELECT * FROM friend_suggestion ORDER BY RAND()", nativeQuery = true)
    List<FriendSuggestion> findRandomSuggestions(Pageable pageable);
    
    

}

