package com.example.social_media.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.UUID;

@Service
public class FileStorageService {
    private static final String profile_path = "uploads/profile_pics/";
    private static final String cover_path = "uploads/cover_pics/";

    public FileStorageService(){
        createDirectories();
    }

    public void createDirectories (){
        try{
            Files.createDirectories(Paths.get(profile_path));
            Files.createDirectories(Paths.get(cover_path));
        }
        catch (IOException e){
            throw new RuntimeException("Loi trong qua trinh tao thu muc", e);
        }
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
