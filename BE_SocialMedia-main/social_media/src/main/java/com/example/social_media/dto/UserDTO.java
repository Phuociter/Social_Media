package com.example.social_media.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Integer userId;
    private String username;
    private String email;
    private String screenName;
    private String bio;
    private String profileCover;
    private String profileImage;
    private String country;
    private String website;

}

