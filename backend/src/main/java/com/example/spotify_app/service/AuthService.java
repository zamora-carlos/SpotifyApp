package com.example.spotify_app.service;

import com.example.spotify_app.config.SpotifyConfig;
import com.example.spotify_app.dto.SpotifyTokenResponse;
import com.example.spotify_app.dto.TokenResponse;
import com.example.spotify_app.model.UserToken;
import com.example.spotify_app.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {
    private final RestTemplate restTemplate;
    private final SpotifyConfig spotifyConfig;
    private final TokenRepository tokenRepository;

    @Autowired
    public AuthService(RestTemplate restTemplate, SpotifyConfig spotifyConfig, TokenRepository tokenRepository) {
        this.restTemplate = restTemplate;
        this.spotifyConfig = spotifyConfig;
        this.tokenRepository = tokenRepository;
    }

    public TokenResponse getSpotifyAccessToken(String code) {
        String requestBody = "code=" + code +
                "&redirect_uri=" + spotifyConfig.getRedirectUri() +
                "&grant_type=authorization_code";

        SpotifyTokenResponse spotifyResponse = makeHttpRequest(requestBody);
        return saveNewUserToken(spotifyResponse);
    }

    public TokenResponse refreshAccessToken(String refreshToken) {
        String requestBody = "refresh_token=" + refreshToken +
                "&grant_type=refresh_token";

        SpotifyTokenResponse spotifyResponse = makeHttpRequest(requestBody);
        return updateUserToken(spotifyResponse);
    }

    private SpotifyTokenResponse makeHttpRequest(String requestBody) {
        String credentials = spotifyConfig.getClientId() + ":" + spotifyConfig.getClientSecret();
        String authHeader = "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", authHeader);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<SpotifyTokenResponse> response = restTemplate.exchange(
                spotifyConfig.getTokenExchangeUrl(),
                HttpMethod.POST,
                request,
                SpotifyTokenResponse.class);

        return response.getBody();
    }

    private TokenResponse saveNewUserToken(SpotifyTokenResponse spotifyResponse) {
        UserToken userToken = new UserToken();
        userToken.setAccessToken(spotifyResponse.getAccessToken());
        userToken.setRefreshToken(spotifyResponse.getRefreshToken());
        userToken.setExpiresAt(Instant.now().plusMillis(spotifyResponse.getExpiresIn()));

        tokenRepository.save(userToken);

        return new TokenResponse(
                spotifyResponse.getAccessToken(),
                userToken.getExpiresAt()
        );
    }

    private TokenResponse updateUserToken(SpotifyTokenResponse spotifyResponse) {
        Optional<UserToken> userTokenOptional = tokenRepository.findByAccessToken(spotifyResponse.getAccessToken());

        if (userTokenOptional.isPresent()) {
            UserToken userToken = userTokenOptional.get();

            if (spotifyResponse.getRefreshToken() != null) {
                userToken.setRefreshToken(spotifyResponse.getRefreshToken());
            }

            userToken.setAccessToken(spotifyResponse.getAccessToken());
            userToken.setExpiresAt(Instant.now().plusSeconds(spotifyResponse.getExpiresIn()));

            tokenRepository.save(userToken);

            return new TokenResponse(
                    spotifyResponse.getAccessToken(),
                    userToken.getExpiresAt()
            );
        } else {
            throw new RuntimeException("No token entry found for the provided access token.");
        }
    }
}
