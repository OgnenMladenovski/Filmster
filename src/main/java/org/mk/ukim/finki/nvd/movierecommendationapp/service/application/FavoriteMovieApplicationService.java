package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayFavoriteMovieResponseDto;
import java.util.List;

public interface FavoriteMovieApplicationService {
    List<DisplayFavoriteMovieResponseDto> findAllByUser(User user);
    DisplayFavoriteMovieResponseDto add(User user, Integer tmdbId);
    void remove(User user, Integer tmdbId);
}
