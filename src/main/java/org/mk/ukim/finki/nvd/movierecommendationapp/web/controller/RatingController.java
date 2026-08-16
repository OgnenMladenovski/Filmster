package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import jakarta.validation.Valid;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.CreateRatingRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DeleteMessageResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayRatingResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.RatingApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingApplicationService ratingApplicationService;

    public RatingController(RatingApplicationService ratingApplicationService) {
        this.ratingApplicationService = ratingApplicationService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<DisplayRatingResponseDto>> findMyRatings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ratingApplicationService.findAllByUser(user));
    }

    @PostMapping
    public ResponseEntity<DisplayRatingResponseDto> rate(@AuthenticationPrincipal User user, @Valid @RequestBody CreateRatingRequestDto createRatingRequestDto) {
        return ResponseEntity.ok(ratingApplicationService.rate(user, createRatingRequestDto));
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<DeleteMessageResponseDto> delete(@AuthenticationPrincipal User user, @PathVariable Integer tmdbId) {
        ratingApplicationService.delete(user, tmdbId);
        return ResponseEntity.ok(new DeleteMessageResponseDto(String.format("Your rating for the movie with id %d was deleted.", tmdbId)));
    }
}
