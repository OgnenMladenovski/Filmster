package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayRecommendationResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.RecommendationApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationApplicationService recommendationApplicationService;

    public RecommendationController(RecommendationApplicationService recommendationApplicationService) {
        this.recommendationApplicationService = recommendationApplicationService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<DisplayRecommendationResponseDto>> findMyRecommendations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recommendationApplicationService.findAllByUser(user));
    }

    @PostMapping("/generate")
    public ResponseEntity<List<DisplayRecommendationResponseDto>> generate(@AuthenticationPrincipal User user) {
        recommendationApplicationService.generate(user);
        return ResponseEntity.ok(recommendationApplicationService.findAllByUser(user));
    }
}
