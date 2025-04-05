package com.example.social_media.entity;

import java.util.Objects;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    public Integer getUserId() {
        return userId;
    }

    @Column(nullable = false, unique = true, length = 40)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "profileimage",length = 255)
    private String profileImage;

    @Column(name = "profilecover",length = 255)
    private String profileCover;

    @Column(name = "bio",length = 140)
    private String bio;

    @Column(name = "country",length = 255)
    private String country;

    @Column(name = "website",length = 255)
    private String website;

    @Column(name = "status",nullable = false, length = 255)
    private Integer status = 0;

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


