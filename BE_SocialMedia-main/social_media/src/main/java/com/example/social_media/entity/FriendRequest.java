package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "friend_request")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RequestID") // tên cột trong DB
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name = "SenderID", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "ReceiverID", nullable = false)
    private User receiver;

    @Column(name = "request_time", nullable = false, updatable = false, 
            columnDefinition = "DATETIME(6) DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime requestTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Status status = Status.pending;

    public enum Status {
        pending, accepted, rejected
    }

    public FriendRequest() {
        this.requestTime = LocalDateTime.now(); // Mặc định thời gian hiện tại
        this.status = Status.pending;
    }

    public FriendRequest(User sender, User receiver) {
        this.sender = sender;
        this.receiver = receiver;
        this.requestTime = LocalDateTime.now();
        this.status = Status.pending;
    }

    public Integer getRequestId() {
        return requestId;
    }

    public void setRequestId(Integer requestId) {
        this.requestId = requestId;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public LocalDateTime getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(LocalDateTime requestTime) {
        this.requestTime = requestTime;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    // Kiểm tra trạng thái
    public boolean isPending() {
        return this.status == Status.pending;
    }

    public void accept() {
        this.status = Status.accepted;
    }

    public void reject() {
        this.status = Status.rejected;
    }



    @Override
    public String toString() {
        return "FriendRequest{" +
                "requestId=" + requestId +
                ", sender=" + sender.getUserId() +
                ", receiver=" + receiver.getUserId() +
                ", requestTime=" + requestTime +
                ", status=" + status +
                '}';
    }
}
