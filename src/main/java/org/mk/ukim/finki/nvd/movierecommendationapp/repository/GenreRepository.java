package org.mk.ukim.finki.nvd.movierecommendationapp.repository;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {
}
