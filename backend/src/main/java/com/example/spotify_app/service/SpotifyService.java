package com.example.spotify_app.service;

import com.example.spotify_app.config.SpotifyConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@Service
public class SpotifyService {
    private final RestTemplate restTemplate;
    private final SpotifyConfig spotifyConfig;

    @Autowired
    public SpotifyService(RestTemplate restTemplate, SpotifyConfig spotifyConfig) {
        this.restTemplate = restTemplate;
        this.spotifyConfig = spotifyConfig;
    }

    public Map getTopItems(String token, int page, String type) {
        int limit = 10;
        int offset = (page - 1) * limit;

        String baseUrl = spotifyConfig.getApiUrl() + "me/top/" + type;

        URI uri = UriComponentsBuilder
                .fromUri(URI.create(baseUrl))
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .build()
                .toUri();

        System.out.println(uri.toString());

        return callSpotifyApi(uri.toString(), token);
    }

    public Map getArtistById(String id, String token) {
        String url = spotifyConfig.getApiUrl() + "artists/" + id;
        return callSpotifyApi(url, token);
    }

    public Map getArtistTopTracks(String id, String token) {
        String url = spotifyConfig.getApiUrl() + "artists/" + id + "/top-tracks";
        return callSpotifyApi(url, token);
    }

    public Map getAlbumById(String id, String token) {
        String url = spotifyConfig.getApiUrl() + "albums/" + id;
        return callSpotifyApi(url, token);
    }

    public Map getTrackById(String id, String token) {
        String url = spotifyConfig.getApiUrl() + "tracks/" + id;
        return callSpotifyApi(url, token);
    }

    public Map getArtistAlbums(String id, String token, int page) {
        int limit = 10;
        int offset = (page - 1) * limit;

        URI uri = UriComponentsBuilder
                .fromUri(URI.create(spotifyConfig.getApiUrl() + "artists/" + id + "/albums"))
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("include_groups", "album,single")
                .queryParam("market", "from_token")
                .build()
                .toUri();

        return callSpotifyApi(uri.toString(), token);
    }

    public Map search(String query, String type, String token, int page) {
        int limit = 10;
        int offset = (page - 1) * limit;

        String baseUrl = spotifyConfig.getApiUrl() + "search";

        URI uri = UriComponentsBuilder
                .fromUri(URI.create(baseUrl))
                .queryParam("q", query)
                .queryParam("type", type)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .queryParam("market", "from_token")
                .build()
                .toUri();

        return callSpotifyApi(uri.toString(), token);
    }

    private Map callSpotifyApi(String url, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        return response.getBody();
    }
}
