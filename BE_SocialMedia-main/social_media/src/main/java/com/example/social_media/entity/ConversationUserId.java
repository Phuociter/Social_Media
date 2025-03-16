package com.example.social_media.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class ConversationUserId implements Serializable {
    private Integer conversationId;
    private Integer userId;
}


