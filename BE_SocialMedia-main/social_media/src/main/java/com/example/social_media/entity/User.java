package com.example.social_media.entity;

import java.util.Objects;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, unique = true, length = 40)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 255)
    private String profileImage;

    @Column(length = 255)
    private String profileCover;

    @Column(length = 140)
    private String bio;

    @Column(length = 255)
    private String country;

    @Column(length = 255)
    private String website;

    // MỚI: Quản lý phân quyền (user/admin)
    @Enumerated(EnumType.STRING)
    @Column(length = 5, nullable = false)
    private Role role = Role.user;

    // public enum Role {
    //     user, admin
    // }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    public int hashCode() {
        return Objects.hash(userId);
    }
}


