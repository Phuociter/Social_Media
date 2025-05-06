
package com.example.social_media.service;

import com.example.social_media.dto.MonthUserDTO;
import com.example.social_media.entity.User;
import com.example.social_media.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
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

    public long countUsersbystatusisactive() {
        return userRepository.countByStatus(1); // Giả sử 1 là trạng thái hoạt động
    }
    public long countUsersbystatusisblock() {
        return userRepository.countByStatus(0); // Giả sử 0 là trạng thái bị khóa
    }
    public User createUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<MonthUserDTO> getUserCountByMonth(int year) {
        return userRepository.countUsersByMonth(year);
    }
    //Đăng ký
    public User registerUser(User user) {
        user.setCreatedAt(new Date());

        user.setRole(user.getRole());
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

    public long count() {
        return userRepository.count();
    }


    public User updateUser (User user) { return  userRepository.save(user);}


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
