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

    @Column(nullable = true, length = 255)
    private String profileimage = "";

    @Column(nullable = true, length = 255)
    private String profilecover = "";

    @Column(length = 140)
    private String bio = null;

    @Column(length = 255)
    private String country = null;

    @Column(length = 255)
    private String website = null;

    // MỚI: Quản lý phân quyền (user/admin)
    @Enumerated(EnumType.STRING)
    @Column(length = 5, nullable = false)
    private Role role = Role.user;


    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId);
    }

    public int hashCode() {
        return Objects.hash(userId);
    }
}
