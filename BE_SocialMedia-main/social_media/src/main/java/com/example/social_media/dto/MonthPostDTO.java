package com.example.social_media.dto;

public class MonthPostDTO {
    private int month;
    private long totalPosts;

    public MonthPostDTO(int month, long totalPosts) {
        this.month = month;
        this.totalPosts = totalPosts;
    }

    public int getMonth() {
        return month;
    }

    public long getTotalPosts() {
        return totalPosts;
    }
}
