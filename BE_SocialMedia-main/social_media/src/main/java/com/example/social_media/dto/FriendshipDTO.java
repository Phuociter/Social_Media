package com.example.social_media.dto;

public class FriendshipDTO {
    private String status;
    private Integer senderId;
    private Integer receiverId;
    private Integer requestId;

    public FriendshipDTO(String status, Integer senderId, Integer receiverId, Integer requestId) {
        this.status = status;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.requestId = requestId;
    }

    // Getters và Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }
}
