package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayMovieDetailsResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayMovieResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.MovieApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieApplicationService movieApplicationService;

    public MovieController(MovieApplicationService movieApplicationService) {
        this.movieApplicationService = movieApplicationService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<DisplayMovieResponseDto>> search(@RequestParam String query) {
        return ResponseEntity.ok(movieApplicationService.search(query));
    }

    @GetMapping("/{tmdbId}")
    public ResponseEntity<DisplayMovieDetailsResponseDto> findByTmdbId(@PathVariable Integer tmdbId) {
        return ResponseEntity.ok(movieApplicationService.findByTmdbId(tmdbId));
    }
}
