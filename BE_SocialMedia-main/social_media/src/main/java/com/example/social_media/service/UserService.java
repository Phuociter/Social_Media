package com.example.social_media.service;

import com.example.social_media.entity.User;
import com.example.social_media.repository.UserRepository;
import com.example.social_media.entity.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    // public User registerUser(User user) {
    //     if (userRepository.findByEmail(user.getEmail()) != null) {
    //         throw new RuntimeException("Email đã tồn tại");
    //     }
    //     if (userRepository.findByUsername(user.getUsername()) != null) {
    //         throw new RuntimeException("Username đã tồn tại");
    //     }
    //     user.setRole(Role.user);
    //     return userRepository.save(user);
    // }
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }
}

