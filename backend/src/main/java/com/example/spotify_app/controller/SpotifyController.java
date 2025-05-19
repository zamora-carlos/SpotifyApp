package com.example.spotify_app.controller;

import com.example.spotify_app.service.SpotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class SpotifyController {
    private final SpotifyService spotifyService;

    @Autowired
    public SpotifyController(SpotifyService spotifyService) {
        this.spotifyService = spotifyService;
    }

    @GetMapping("/top/artists")
    public ResponseEntity<Map<String, Object>> getTopArtists(
            @RequestParam String token,
            @RequestParam int page
    ) {
        Map<String, Object> result = spotifyService.getTopItems(token, page, "artists");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/top/tracks")
    public ResponseEntity<Map<String, Object>> getTopTracks(
            @RequestParam String token,
            @RequestParam int page
    ) {
        Map<String, Object> result = spotifyService.getTopItems(token, page, "tracks");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/artist/{id}")
    public ResponseEntity<Map<String, Object>> getArtistById(
            @PathVariable String id,
            @RequestParam String token
    ) {
        return ResponseEntity.ok(spotifyService.getArtistById(id, token));
    }

    @GetMapping("/artist/{id}/top-tracks")
    public ResponseEntity<Map<String, Object>> getArtistTopTracks(
            @PathVariable String id,
            @RequestParam String token
    ) {
        return ResponseEntity.ok(spotifyService.getArtistTopTracks(id, token));
    }

    @GetMapping("/artist/{id}/related-artists")
    public ResponseEntity<Map<String, Object>> getRelatedArtists(
            @PathVariable String id,
            @RequestParam String token
    ) {
        return ResponseEntity.ok(spotifyService.getRelatedArtists(id, token));
    }

    @GetMapping("/artist/{id}/albums")
    public ResponseEntity<Map<String, Object>> getArtistAlbums(
            @PathVariable String id,
            @RequestParam String token,
            @RequestParam int page
    ) {
        return ResponseEntity.ok(spotifyService.getArtistAlbums(id, token, page));
    }

    @GetMapping("/album/{id}")
    public ResponseEntity<Map<String, Object>> getAlbumById(
            @PathVariable String id,
            @RequestParam String token
    ) {
        return ResponseEntity.ok(spotifyService.getAlbumById(id, token));
    }

    @GetMapping("/track/{id}")
    public ResponseEntity<Map<String, Object>> getTrackById(
            @PathVariable String id,
            @RequestParam String token
    ) {
        return ResponseEntity.ok(spotifyService.getTrackById(id, token));
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String query,
            @RequestParam String type,
            @RequestParam int page,
            @RequestParam String token
    ) {
        return ResponseEntity.ok(spotifyService.search(query, type, token, page));
    }
}
