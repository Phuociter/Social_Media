package com.example.social_media.controller;

import com.example.social_media.config.MessageResponse;

import com.example.social_media.entity.User;
import com.example.social_media.service.UserService;

import com.example.social_media.service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {

            String email = user.getEmail();
            if (userService.getUserByEmail(email) != null ) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageResponse("Email đã tồn tại"));
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
            if (userLogin != null) {
                userLogin.setPassword(null);
                if (userLogin.getProfileImage() != null && !userLogin.getProfileImage().isEmpty()) {
                    if (!userLogin.getProfileImage().startsWith("http")) {
                        String imageUrl = "http://localhost:8080" + userLogin.getProfileImage();
                        userLogin.setProfileImage(imageUrl);
                    }
                }

                if (userLogin.getProfileCover() != null && !userLogin.getProfileCover().isEmpty()) {
                    if (!userLogin.getProfileCover().startsWith("http")) {
                        String imageUrl = "http://localhost:8080" + userLogin.getProfileCover();
                        userLogin.setProfileCover(imageUrl);
                    }
                }


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

    @GetMapping("/{userId}")
    public Optional<User> getUserById(@PathVariable Integer userId) {
        return userService.getUserById(userId);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
    // block user
    @PostMapping("/{userId}")
    public ResponseEntity<?> blockUser(@PathVariable Integer userId) {
        Optional<User> optionalUser = userService.getUserById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setStatus(0); // Đặt trạng thái là 0 (bị khóa)
        userService.updateUser(user.getUserId());

        return ResponseEntity.ok(new MessageResponse("Tài khoản đã bị khóa"));
    }

    

    // Post /api/users/{id} để cập nhật thông tin user
    // POST /api/users/{id}/InfoChanging: Cập nhật thông tin cơ bản người dùng (không bao gồm ảnh)
    @PostMapping("/{userId}/InfoChanging")
    public ResponseEntity<Map<String, String>> updateUserInfo(
            @PathVariable Integer userId,
            @RequestBody User updatedUser) {

        Optional<User> optionalUser = userService.getUserById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        // Chỉ update các trường frontend gửi lên
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setProfession(updatedUser.getProfession());
        user.setBio(updatedUser.getBio());
        if(user.getStatus() == null || user.getStatus() == 0){
            user.setStatus(1);
        }
        user.setCountry(updatedUser.getCountry());
        user.setWebsite(updatedUser.getWebsite());

        // Giữ lại các giá trị bắt buộc không được null
        // password, status, role đã có sẵn trong `user` rồi, nên không cần set lại nếu không thay đổi

        userService.updateUser(user.getUserId());


        Map<String, String> response = new HashMap<>();
        response.put("message", "Cập nhật thông tin thành công");

        return ResponseEntity.ok(response);
    }


    //Post /api/users/{id}/Profile/PictureChanging Thay doi anh dai dien
    @PostMapping("/{userId}/Profile/PictureChanging")
    public ResponseEntity<Map<String, String>> uploadProfilePic(
            @PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {
        try {
            Optional<User> optionalUser = userService.getUserById(userId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = optionalUser.get();
            String fileName = fileStorageService.saveProfilepic(file);
            user.setProfileImage("/uploads/profile_pics/" + fileName);
            userService.updateUser(user.getUserId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Cap nhat anh dai dien thanh cong");
            response.put("profilePicUrl", user.getProfileImage());

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload file"));
        }
    }

    //Post /api/users/{id}/Profile/CoverChanging Thay doi anh bia
    @PostMapping("/{userId}/Profile/CoverChanging")
    public ResponseEntity<Map<String, String>> uploadCoverPic(@PathVariable Integer userId,
                                                              @RequestParam("file") MultipartFile file){
        try{
            Optional<User> optionalUser = userService.getUserById(userId);
            if (!optionalUser.isPresent()){
                return ResponseEntity.notFound().build();
            }

            User user = optionalUser.get();
            String fileName = fileStorageService.saveCoverpic(file);
            user.setProfileCover("/uploads/cover_pics/"+ fileName);
            userService.updateUser(user.getUserId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Cap nhat anh bia thanh cong");
            response.put("coverPicUrl", user.getProfileCover());

            return  ResponseEntity.ok(response);
        }catch (IOException e){
            return ResponseEntity.badRequest().body(Map.of("error","fail to upload file"));
        }
    }

}

