package com.siteai.backend.payload;

public record AuthResponse(String token, String userEmail, String username) {
}