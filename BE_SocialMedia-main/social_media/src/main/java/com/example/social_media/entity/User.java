package com.example.social_media.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, unique = true, length = 40)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 40)
    private String screenName;

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
    private Role role = Role.USER;

    // MỚI: Lưu số điện thoại (tuỳ chọn)
    @Column(length = 20)
    private String phoneNumber;

    public enum Role {
        USER, ADMIN
    }
}


