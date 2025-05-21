package com.example.spotify_app.controller;

import com.example.spotify_app.service.SpotifyService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SpotifyController.class)
class SpotifyControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SpotifyService spotifyService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetTopArtists() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("items", new ArrayList<>());

        Mockito.when(spotifyService.getTopItems(anyString(), eq(1), eq("artists")))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/top/artists")
                        .param("token", "token")
                        .param("page", "1"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testGetTopTracks() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("items", new ArrayList<>());

        Mockito.when(spotifyService.getTopItems(anyString(), eq(2), eq("tracks")))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/top/tracks")
                        .param("token", "token")
                        .param("page", "2"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testGetArtistById() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("name", "Artist test");

        Mockito.when(spotifyService.getArtistById(eq("artistId"), anyString()))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/artist/{id}", "artistId")
                        .param("token", "token"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testGetArtistTopTracks() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("items", new ArrayList<>());

        Mockito.when(spotifyService.getArtistTopTracks(eq("artistId"), anyString()))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/artist/{id}/top-tracks", "artistId")
                        .param("token", "token"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testGetArtistAlbums() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("items", new ArrayList<>());

        Mockito.when(spotifyService.getArtistAlbums(eq("artistId"), anyString(), eq(5)))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/artist/{id}/albums", "artistId")
                        .param("token", "token")
                        .param("page", "5"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testGetAlbumById() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("name", "Album test");

        Mockito.when(spotifyService.getAlbumById(eq("albumId"), anyString()))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/album/{id}", "albumId")
                        .param("token", "token"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testGetTrackById() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("name", "Track test");

        Mockito.when(spotifyService.getTrackById(eq("trackId"), anyString()))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/track/{id}", "trackId")
                        .param("token", "token"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }

    @Test
    void testSearch() throws Exception {
        // Arrange
        Map<String, Object> mockResponse = Map.of("items", new ArrayList<>());

        Mockito.when(spotifyService.search(eq("query"), eq("artist"), anyString(), eq(3)))
                .thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/api/v1/search")
                        .param("query", "query")
                        .param("type", "artist")
                        .param("page", "3")
                        .param("token", "token"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(mockResponse)));
    }
}
