package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayWatchlistItemResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.WatchlistApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistApplicationService watchlistApplicationService;

    public WatchlistController(WatchlistApplicationService watchlistApplicationService) {
        this.watchlistApplicationService = watchlistApplicationService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<DisplayWatchlistItemResponseDto>> findMyWatchlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(watchlistApplicationService.findAllByUser(user));
    }

    @PostMapping("/{tmdbId}")
    public ResponseEntity<DisplayWatchlistItemResponseDto> add(@AuthenticationPrincipal User user, @PathVariable Integer tmdbId) {
        return ResponseEntity.ok(watchlistApplicationService.add(user, tmdbId));
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> remove(@AuthenticationPrincipal User user, @PathVariable Integer tmdbId) {
        watchlistApplicationService.remove(user, tmdbId);
        return ResponseEntity.noContent().build();
    }
}
