package com.example.spotify_app.service;

import com.example.spotify_app.config.SpotifyConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SpotifyServiceTest {
    @Mock
    private RestTemplate restTemplate;

    @Mock
    private SpotifyConfig spotifyConfig;

    private SpotifyService spotifyService;

    @BeforeEach
    public void setup() {
        when(spotifyConfig.getApiUrl()).thenReturn("https://api.spotify.com/v1/");
        spotifyService = new SpotifyService(restTemplate, spotifyConfig);
    }

    @ParameterizedTest
    @CsvSource({
            "artists, 1",
            "artists, 2",
            "tracks, 3"
    })
    public void testGetTopItems(String type, int page) {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("items", new ArrayList<>());
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        String url = "https://api.spotify.com/v1/me/top/" + type + "?limit=10&offset=" + (page - 1) * 10;

        when(restTemplate.exchange(
                eq(url),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.getTopItems("abcd", page, type);

        // Assert
        assertEquals(expectedResponse, actualResponse);

        verify(restTemplate, times(1)).exchange(
                eq(url),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        );
    }

    @Test
    public void testGetArtistById() {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("name", "Artist test");

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://api.spotify.com/v1/artists/123"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.getArtistById("123", "token");

        // Assert
        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testGetArtistTopTracks() {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("tracks", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://api.spotify.com/v1/artists/123/top-tracks"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.getArtistTopTracks("123", "token");

        // Assert
        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testGetAlbumById() {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("name", "Album test");

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://api.spotify.com/v1/albums/123"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.getAlbumById("123", "token");

        // Assert
        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testGetTrackById() {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("name", "Track test");

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        when(restTemplate.exchange(
                eq("https://api.spotify.com/v1/tracks/123"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.getTrackById("123", "token");

        // Arrange
        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testGetArtistAlbums() {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("items", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        String expectedUrl = "https://api.spotify.com/v1/artists/123/albums?limit=10&offset=0&include_groups=album,single&market=from_token";

        when(restTemplate.exchange(
                eq(expectedUrl),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.getArtistAlbums("123", "token", 1);

        // Assert
        assertEquals(expectedResponse, actualResponse);
    }

    @ParameterizedTest
    @CsvSource({
            "a-song, track, 1",
            "an-artist, artist, 2",
            "a-playlist, playlist, 3"
    })
    public void testSearch(String search, String type, int page) {
        // Arrange
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("items", new ArrayList<>());

        ResponseEntity<Map> responseEntity = new ResponseEntity<>(expectedResponse, HttpStatus.OK);

        String expectedUrl = "https://api.spotify.com/v1/search?q="
                + search
                + "&type=" + type
                + "&limit=10"
                + "&offset=" + (page - 1) * 10
                + "&market=from_token";

        when(restTemplate.exchange(
                eq(expectedUrl),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Map.class)
        )).thenReturn(responseEntity);

        // Act
        Map actualResponse = spotifyService.search(search, type, "token", page);

        // Assert
        assertEquals(expectedResponse, actualResponse);
    }
}
