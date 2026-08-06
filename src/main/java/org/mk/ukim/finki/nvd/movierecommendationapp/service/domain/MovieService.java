package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import java.util.Optional;

public interface MovieService {
    Optional<Movie> findById(Long id);
    Optional<Movie> findByTmdbId(Integer tmdbId);
    Movie findOrCreateByTmdbId(Integer tmdbId);
}
