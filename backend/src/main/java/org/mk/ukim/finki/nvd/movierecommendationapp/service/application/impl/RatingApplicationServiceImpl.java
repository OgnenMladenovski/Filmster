package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Rating;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.CreateRatingRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayRatingResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.MovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.RatingApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.MovieService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.RatingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RatingApplicationServiceImpl implements RatingApplicationService {

    private final RatingService ratingService;
    private final MovieService movieService;

    public RatingApplicationServiceImpl(RatingService ratingService, MovieService movieService) {
        this.ratingService = ratingService;
        this.movieService = movieService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisplayRatingResponseDto> findAllByUser(User user) {
        return DisplayRatingResponseDto.from(ratingService.findAllByUser(user));
    }

    @Override
    @Transactional
    public DisplayRatingResponseDto rate(User user, CreateRatingRequestDto createRatingRequestDto) {
        Movie movie = movieService.findOrCreateByTmdbId(createRatingRequestDto.tmdbId());
        Rating rating = ratingService.rate(user, movie, createRatingRequestDto.score(), createRatingRequestDto.review());
        return DisplayRatingResponseDto.from(rating);
    }

    @Override
    @Transactional
    public void delete(User user, Integer tmdbId) {
        Movie movie = movieService.findByTmdbId(tmdbId).orElseThrow(() -> new MovieNotFoundException(tmdbId));
        ratingService.delete(user, movie);
    }
}
