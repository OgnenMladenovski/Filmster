package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.CreateRatingRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayRatingResponseDto;
import java.util.List;

public interface RatingApplicationService {
    List<DisplayRatingResponseDto> findAllByUser(User user);
    DisplayRatingResponseDto rate(User user, CreateRatingRequestDto createRatingRequestDto);
    void delete(User user, Integer tmdbId);
}
