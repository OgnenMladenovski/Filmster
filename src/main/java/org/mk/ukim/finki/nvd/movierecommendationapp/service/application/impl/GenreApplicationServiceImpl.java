package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayGenreResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.GenreApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.GenreService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenreApplicationServiceImpl implements GenreApplicationService {
    private final GenreService genreService;

    public GenreApplicationServiceImpl(GenreService genreService) {
        this.genreService = genreService;
    }

    @Override
    public List<DisplayGenreResponseDto> findAll() {
        return DisplayGenreResponseDto.from(genreService.findAll());
    }

    @Override
    public Optional<DisplayGenreResponseDto> findById(Long id) {
        return genreService
                .findById(id)
                .map(DisplayGenreResponseDto::from);
    }
}
