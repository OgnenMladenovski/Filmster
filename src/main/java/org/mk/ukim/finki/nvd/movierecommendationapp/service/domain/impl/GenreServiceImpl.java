package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Genre;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.GenreRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.GenreService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenreServiceImpl implements GenreService {
    private final GenreRepository genreRepository;

    public GenreServiceImpl(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @Override
    public List<Genre> findAll() {
        return genreRepository.findAll();
    }

    @Override
    public Optional<Genre> findById(Long id) {
        return genreRepository.findById(id);
    }

    @Override
    public Optional<Genre> findByTmdbId(Integer tmdbId) {
        return genreRepository.findByTmdbId(tmdbId);
    }
}
