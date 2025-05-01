
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
    private static final String profile_path = "uploads/profile_pics/";
    private static final String cover_path = "uploads/cover_pics/";


    public void createDirectories (){
        try{
            Files.createDirectories(Paths.get(profile_path));
            Files.createDirectories(Paths.get(cover_path));
        }
        catch (IOException e){
            throw new RuntimeException("Loi trong qua trinh tao thu muc", e);
        }
    }

    public FileStorageService() {
        // Sử dụng đường dẫn tuyệt đối và normalize

        this.uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo thư mục uploads: " + e.getMessage());
        }
        createDirectories();
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
    public String saveProfilepic(MultipartFile file) throws IOException{
        if (file.isEmpty() || !isValidImage(file)) {
            throw new IOException("Invalid file");
        }

        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = Paths.get(profile_path, fileName);

        Files.write(filePath, file.getBytes());

        return fileName;
    }
    public String saveCoverpic(MultipartFile file) throws IOException{
        if (file.isEmpty() || !isValidImage(file)) {
            throw new IOException("File khong hop le");
        }

        String fileExtension = getFileExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = Paths.get(cover_path, filename);

        Files.write(filePath, file.getBytes());

        return filename;

    }
    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
    private boolean isValidImage(MultipartFile file) throws IOException {
        String mimeType = Files.probeContentType(Paths.get(file.getOriginalFilename()));
        return mimeType != null && mimeType.startsWith("image/");
    }
}
