package com.example.spotify_app.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class SpotifyConfig {
    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;

    @Value("${spotify.redirect-uri}")
    private String redirectUri;

    private final String tokenExchangeUrl = "https://accounts.spotify.com/api/token";
    private final String authUrl = "https://accounts.spotify.com/authorize";
    private final String apiUrl = "https://api.spotify.com/v1/";
}
