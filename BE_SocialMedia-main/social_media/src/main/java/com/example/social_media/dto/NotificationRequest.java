package com.example.social_media.dto;

public class NotificationRequest {
    private Integer actorId;
    private Integer userId;
    private String type;
    private String content;
    private Integer referenceId; // ID của đối tượng mà thông báo liên quan đến (ví dụ: bài viết, bình luận, v.v.)

    // Getters và Setters
    public Integer getActorId() {
        return actorId;
    }

    public void setActorId(Integer actorId) {
        this.actorId = actorId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Integer referenceId) {
        this.referenceId = referenceId;
    }
}
