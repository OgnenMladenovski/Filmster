package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Genre;
import java.util.List;
import java.util.Optional;

public interface GenreService {
    List<Genre> findAll();
    Optional<Genre> findById(Long id);
    Optional<Genre> findByTmdbId(Integer tmdbId);
}
