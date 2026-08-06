package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Rating;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.InvalidRatingScoreException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.RatingNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.RatingRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.RatingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;

    public RatingServiceImpl(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    @Override
    public List<Rating> findAllByUser(User user) {
        return ratingRepository.findAllByUserId(user.getId());
    }

    @Override
    public Optional<Rating> findByUserAndMovie(User user, Movie movie) {
        return ratingRepository.findByUserIdAndMovieId(user.getId(), movie.getId());
    }

    @Override
    public Rating rate(User user, Movie movie, BigDecimal score, String review) {
        validateScore(score);

        return ratingRepository
                .findByUserIdAndMovieId(user.getId(), movie.getId())
                .map(existing -> {
                    existing.setScore(score);
                    existing.setReview(review);
                    return ratingRepository.save(existing);
                })
                .orElseGet(() -> ratingRepository.save(new Rating(user, movie, score, review)));
    }

    @Override
    public void delete(User user, Movie movie) {
        Rating rating = ratingRepository.findByUserIdAndMovieId(user.getId(), movie.getId()).orElseThrow(() -> new RatingNotFoundException(movie.getTmdbId()));
        ratingRepository.delete(rating);
    }

    private void validateScore(BigDecimal score) {
        if (score.compareTo(new BigDecimal("0.0")) < 0
                || score.compareTo(new BigDecimal("5.0")) > 0
                || score.remainder(new BigDecimal("0.5")).compareTo(BigDecimal.ZERO) != 0) {
            throw new InvalidRatingScoreException(score);
        }
    }
}
