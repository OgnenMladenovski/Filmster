package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Rating;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface RatingService {
    List<Rating> findAllByUser(User user);
    Optional<Rating> findByUserAndMovie(User user, Movie movie);
    Rating rate(User user, Movie movie, BigDecimal score, String review);
    void delete(User user, Movie movie);
}
