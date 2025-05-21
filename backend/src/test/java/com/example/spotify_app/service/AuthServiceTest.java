package com.example.spotify_app.service;

import com.example.spotify_app.config.SpotifyConfig;
import com.example.spotify_app.dto.SpotifyTokenResponse;
import com.example.spotify_app.dto.TokenResponse;
import com.example.spotify_app.model.UserToken;
import com.example.spotify_app.repository.TokenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private RestTemplate restTemplate;

    @Mock
    private SpotifyConfig spotifyConfig;

    @Mock
    private TokenRepository tokenRepository;

    @InjectMocks
    private AuthService authService;

    private SpotifyTokenResponse mockSpotifyResponse;

    @Test
    void testGetSpotifyAccessToken() {
        // Arrange
        when(spotifyConfig.getRedirectUri()).thenReturn("http://127.0.0.1:8080/callback");

        mockSpotifyResponse = new SpotifyTokenResponse();
        mockSpotifyResponse.setAccessToken("new-access-token");
        mockSpotifyResponse.setRefreshToken("new-refresh-token");
        mockSpotifyResponse.setExpiresIn(3600);

        when(spotifyConfig.getClientId()).thenReturn("client-id");
        when(spotifyConfig.getClientSecret()).thenReturn("client-secret");
        when(spotifyConfig.getTokenExchangeUrl()).thenReturn("https://accounts.spotify.com/api/token");

        ResponseEntity<SpotifyTokenResponse> response = new ResponseEntity<>(mockSpotifyResponse, HttpStatus.OK);
        when(restTemplate.exchange(
                eq("https://accounts.spotify.com/api/token"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(SpotifyTokenResponse.class)
        )).thenReturn(response);

        // Act
        TokenResponse tokenResponse = authService.getSpotifyAccessToken("auth-code");

        // Assert
        assertEquals("new-access-token", tokenResponse.getAccessToken());
        assertTrue(tokenResponse.getExpiresAt().isAfter(Instant.now()));
        verify(tokenRepository, times(1)).save(any(UserToken.class));
    }

    @Test
    void testRefreshAccessToken() {
        // Arrange
        UserToken storedToken = new UserToken();
        storedToken.setAccessToken("expired-access-token");
        storedToken.setRefreshToken("stored-refresh-token");

        mockSpotifyResponse = new SpotifyTokenResponse();
        mockSpotifyResponse.setAccessToken("new-access-token");
        mockSpotifyResponse.setRefreshToken("new-refresh-token");
        mockSpotifyResponse.setExpiresIn(3600);

        when(spotifyConfig.getClientId()).thenReturn("client-id");
        when(spotifyConfig.getClientSecret()).thenReturn("client-secret");
        when(spotifyConfig.getTokenExchangeUrl()).thenReturn("https://accounts.spotify.com/api/token");

        when(tokenRepository.findByAccessToken("expired-access-token"))
                .thenReturn(Optional.of(storedToken));

        ResponseEntity<SpotifyTokenResponse> response = new ResponseEntity<>(mockSpotifyResponse, HttpStatus.OK);
        when(restTemplate.exchange(
                eq("https://accounts.spotify.com/api/token"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(SpotifyTokenResponse.class)
        )).thenReturn(response);

        // Act
        TokenResponse refreshed = authService.refreshAccessToken("expired-access-token");

        // Assert
        assertEquals("new-access-token", refreshed.getAccessToken());
        verify(tokenRepository).save(any(UserToken.class));
    }

    @Test
    void testRefreshAccessToken_NotFound() {
        // Arrange
        when(tokenRepository.findByAccessToken("invalid-token")).thenReturn(Optional.empty());

        // Act
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authService.refreshAccessToken("invalid-token"));

        // Assert
        assertTrue(ex.getMessage().contains("No token entry found"));
    }
}
