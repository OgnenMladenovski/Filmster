package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayRecommendationResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.RecommendationApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.RecommendationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecommendationApplicationServiceImpl implements RecommendationApplicationService {

    private final RecommendationService recommendationService;

    public RecommendationApplicationServiceImpl(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisplayRecommendationResponseDto> findAllByUser(User user) {
        return DisplayRecommendationResponseDto.from(recommendationService.findAllByUser(user));
    }

    @Override
    @Transactional
    public void generate(User user) {
        recommendationService.generate(user);
    }
}
