package com.example.social_media.controller;

import com.example.social_media.config.MessageResponse;

import com.example.social_media.entity.User;
import com.example.social_media.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {

            String email = user.getEmail();
            String username = user.getUsername();
            if (userService.getUserByEmail(email) != null || userService.getUserByUsername(username) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Email hoặc username đã tồn tại"));
            }
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Có lỗi xảy ra khi đăng ký"));
        }

    }

    // Đăng nhập

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
            // Kiểm tra status của user
            if (userLogin != null) {
                if (userLogin.getStatus().equals(0)) {
                    return ResponseEntity
                            .status(HttpStatus.UNAUTHORIZED)
                            .body(new MessageResponse("Tài khoản của bạn đã bị khóa"));

                }
                // Nếu đăng nhập thành công
                // Xóa password
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

    @PutMapping("/block/{id}")
    public void blockUser(@PathVariable Integer id) {
        userService.blockUser(id);      
    }

    @PutMapping("/{id}")
    public void updateUser(@PathVariable Integer id, @RequestBody User user) {
        userService.updateUser(id, user);
        System.out.println("User updated successfully");
    }

}

