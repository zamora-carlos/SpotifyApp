package com.example.spotify_app.repository;

import com.example.spotify_app.model.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<UserToken, Long> {
    Optional<UserToken> findByAccessToken(String accessToken);
}