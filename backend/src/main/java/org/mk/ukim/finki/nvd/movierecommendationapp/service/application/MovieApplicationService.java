package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayMovieDetailsResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayMovieResponseDto;
import java.util.List;

public interface MovieApplicationService {
    List<DisplayMovieResponseDto> search(String query);
    DisplayMovieDetailsResponseDto findByTmdbId(Integer tmdbId);
    List<DisplayMovieResponseDto> findByGenre(Integer genreTmdbId);
}
