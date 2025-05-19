package com.example.spotify_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;
    private Instant expiresAt;
}
