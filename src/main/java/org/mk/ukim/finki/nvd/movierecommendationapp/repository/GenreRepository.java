package org.mk.ukim.finki.nvd.movierecommendationapp.repository;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByTmdbId(Integer tmdbId);
}
