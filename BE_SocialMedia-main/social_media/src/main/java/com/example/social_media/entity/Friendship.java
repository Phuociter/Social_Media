package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "friendship")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FriendshipID")
    private Integer friendshipId;

    @ManyToOne
    @JoinColumn(name = "UserID1", nullable = false)
    private User user1;

    @ManyToOne
    @JoinColumn(name = "UserID2", nullable = false)
    private User user2;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date timestamp = new Date();

    // MỚI: Thời gian mối quan hệ được chấp nhận
    @Temporal(TemporalType.TIMESTAMP)
    private Date acceptedAt;

    public boolean containsUser(User user) {
        return user.equals(user1) || user.equals(user2);
    }
    
    // Kiểm tra hai người dùng có phải là bạn của nhau không (không phân biệt thứ tự)
    public boolean isFriend(User u1, User u2) {
        return (user1.equals(u1) && user2.equals(u2)) || (user1.equals(u2) && user2.equals(u1));
    }
}
