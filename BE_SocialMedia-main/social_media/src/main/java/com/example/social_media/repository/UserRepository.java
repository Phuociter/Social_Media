package com.example.social_media.repository;

import com.example.social_media.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    User findByEmail(String email);

    User findByStatus(Integer status);

    List<User> findByUsernameContainingIgnoreCase(String keyword);

    Optional<User> findByEmailIgnoreCase(String email);
}
