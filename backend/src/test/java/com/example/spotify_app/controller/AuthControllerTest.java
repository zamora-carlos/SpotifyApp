package com.example.spotify_app.controller;

import com.example.spotify_app.dto.RefreshRequest;
import com.example.spotify_app.dto.TokenRequest;
import com.example.spotify_app.dto.TokenResponse;
import com.example.spotify_app.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAccessToken() throws Exception {
        // Arrange
        TokenRequest request = new TokenRequest();
        request.setCode("valid-auth-code");

        TokenResponse mockResponse = new TokenResponse("access-token", Instant.now().plusSeconds(3600));

        Mockito.when(authService.getSpotifyAccessToken("valid-auth-code"))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"));
    }

    @Test
    void testRefreshAccessToken() throws Exception {
        // Arrange
        RefreshRequest request = new RefreshRequest();
        request.setAccessToken("expired-token");

        TokenResponse mockResponse = new TokenResponse("new-access-token", Instant.now().plusSeconds(3600));

        Mockito.when(authService.refreshAccessToken("expired-token"))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"));
    }
}
