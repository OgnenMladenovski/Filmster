package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DeleteMessageResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayFavoriteMovieResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.FavoriteMovieApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteMovieController {

    private final FavoriteMovieApplicationService favoriteMovieApplicationService;

    public FavoriteMovieController(FavoriteMovieApplicationService favoriteMovieApplicationService) {
        this.favoriteMovieApplicationService = favoriteMovieApplicationService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<DisplayFavoriteMovieResponseDto>> findMyFavoriteMovies(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(favoriteMovieApplicationService.findAllByUser(user));
    }

    @PostMapping("/{tmdbId}")
    public ResponseEntity<DisplayFavoriteMovieResponseDto> add(@AuthenticationPrincipal User user, @PathVariable Integer tmdbId) {
        return ResponseEntity.ok(favoriteMovieApplicationService.add(user, tmdbId));
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<DeleteMessageResponseDto> remove(@AuthenticationPrincipal User user, @PathVariable Integer tmdbId) {
        favoriteMovieApplicationService.remove(user, tmdbId);
        return ResponseEntity.ok(new DeleteMessageResponseDto(String.format("The movie with id %d was removed from your favorite list.", tmdbId)));
    }
}
