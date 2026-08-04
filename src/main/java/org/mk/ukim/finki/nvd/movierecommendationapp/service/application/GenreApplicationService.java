package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayGenreResponseDto;
import java.util.List;
import java.util.Optional;

public interface GenreApplicationService {
    List<DisplayGenreResponseDto> findAll();
    Optional<DisplayGenreResponseDto> findById(Long id);
}
