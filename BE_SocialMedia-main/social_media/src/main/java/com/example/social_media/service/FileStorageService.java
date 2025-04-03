package com.example.social_media.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final Path uploadDir;

    public FileStorageService() {
        // Sử dụng đường dẫn tuyệt đối và normalize
        this.uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo thư mục uploads: " + e.getMessage());
        }
    }

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được null hoặc rỗng");
        }

        // Tạo tên file an toàn
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.contains("..")) {
            throw new IllegalArgumentException("Tên file không hợp lệ");
        }

        String fileName = UUID.randomUUID() + "_" + originalFilename;

        // Tạo đường dẫn đầy đủ
        Path filePath = this.uploadDir.resolve(fileName).normalize();

        // Kiểm tra bảo mật - không cho phép path traversal
        if (!filePath.getParent().equals(this.uploadDir)) {
            throw new IllegalArgumentException("Không thể lưu file bên ngoài thư mục upload");
        }

        // Tạo thư mục nếu chưa tồn tại
        if (!Files.exists(filePath.getParent())) {
            Files.createDirectories(filePath.getParent());
        }

        // Lưu file
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/" + fileName;
    }
}