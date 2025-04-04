package com.example.social_media.controller;


import com.example.social_media.entity.User;
import com.example.social_media.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            String email = user.getEmail();
            String password = user.getPassword();
            
            // Kiểm tra email và password không được null hoặc rỗng
            if (email == null || email.trim().isEmpty() || 
                password == null || password.trim().isEmpty()) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Email và mật khẩu không được để trống"));
            }

            User userLogin = userService.loginUser(email, password);
            
            // Nếu đăng nhập thành công
            if (userLogin != null) {
                userLogin.setPassword(null);
                return ResponseEntity.ok(userLogin);
            }
            
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Email hoặc mật khẩu không chính xác"));
                
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Có lỗi xảy ra khi đăng nhập"));
        }
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    public class MessageResponse {
        private String message;
    
        public MessageResponse(String message) {
            this.message = message;
        }
    
        public String getMessage() {
            return message;
        }
    
        public void setMessage(String message) {
            this.message = message;
        }
    }
}

