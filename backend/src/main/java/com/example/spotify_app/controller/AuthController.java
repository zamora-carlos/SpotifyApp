package com.example.spotify_app.controller;

import com.example.spotify_app.dto.RefreshRequest;
import com.example.spotify_app.dto.TokenRequest;
import com.example.spotify_app.dto.TokenResponse;
import com.example.spotify_app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/token")
    public ResponseEntity<TokenResponse> getAccessToken(@RequestBody TokenRequest request) {
        TokenResponse response = authService.getSpotifyAccessToken(request.getCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshAccessToken(@RequestBody RefreshRequest request) {
        TokenResponse response = authService.refreshAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }
}