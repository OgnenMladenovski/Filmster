package org.mk.ukim.finki.nvd.movierecommendationapp.repository;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);
    List<Rating> findAllByUserId(Long userId);
}
