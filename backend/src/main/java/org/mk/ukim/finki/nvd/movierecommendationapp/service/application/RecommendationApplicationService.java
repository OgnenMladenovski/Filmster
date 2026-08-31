package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayRecommendationResponseDto;
import java.util.List;

public interface RecommendationApplicationService {
    List<DisplayRecommendationResponseDto> findAllByUser(User user);
    void generate(User user);
}
