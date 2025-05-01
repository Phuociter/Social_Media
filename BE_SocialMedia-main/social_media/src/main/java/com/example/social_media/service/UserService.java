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

    public long count() {
        return userRepository.count();
    }

    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserByStatus(Integer status) {
        return userRepository.findByStatus(status);
    }
    //Đăng ký
    public User registerUser(User user) {
        user.setRole(Role.user);
        return userRepository.save(user);
    }
    //Đăng nhập
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    //Cập nhật thông tin user
    public User updateUser(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setUsername(user.getUsername());
            user.setEmail(user.getEmail());
            user.setRole(user.getRole());
            user.setStatus(user.getStatus());
            return userRepository.save(user);
        }
        return null;
    }

    //Khóa tài khoản
    public User blockUser(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setStatus(user.getStatus() == 1 ? 0 : 1); // Giả sử 0 là trạng thái bị khóa
            return userRepository.save(user);
        }
        return null;
    }
}
