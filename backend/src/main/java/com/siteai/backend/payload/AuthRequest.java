package com.siteai.backend.payload;

public record AuthRequest(String email, String password, String username) {
}