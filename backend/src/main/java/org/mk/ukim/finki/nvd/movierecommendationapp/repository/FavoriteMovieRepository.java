package org.mk.ukim.finki.nvd.movierecommendationapp.repository;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.FavoriteMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteMovieRepository extends JpaRepository<FavoriteMovie, Long> {
    Optional<FavoriteMovie> findByUserIdAndMovieId(Long userId, Long movieId);
    List<FavoriteMovie> findAllByUserIdOrderByIdAsc(Long userId);
    Long countByUserId(Long userId);
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
}
