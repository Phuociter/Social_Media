package com.example.social_media.dto;

public class MonthUserDTO {
    private int month;
    private long totalUsers;

    public MonthUserDTO(int month, long totalUsers) {
        this.month = month;
        this.totalUsers = totalUsers;
    }

    public int getMonth() {
        return month;
    }

    public long getTotalUsers() {
        return totalUsers;
    }
}

