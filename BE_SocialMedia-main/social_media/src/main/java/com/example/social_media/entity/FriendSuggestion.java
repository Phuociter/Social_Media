package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "friend_suggestion")
public class FriendSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SuggestionID")
    private Integer suggestionId;

    @ManyToOne
    @JoinColumn(name = "SuggestedUserID", nullable = false)
    private User suggestedUser;

    @Column(name = "suggestion_time", nullable = false, updatable = false, 
            columnDefinition = "DATETIME(6) DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime suggestionTime;

    // Constructor không tham số (cần cho JPA)
    public FriendSuggestion() {
        this.suggestionTime = LocalDateTime.now();
    }

    // Constructor có tham số để tạo FriendSuggestion từ một User
    public FriendSuggestion(User suggestedUser) {
        this.suggestedUser = suggestedUser;
        this.suggestionTime = LocalDateTime.now();
    }
}

