package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.FavoriteMovie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayFavoriteMovieResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.MovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.FavoriteMovieApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.FavoriteMovieService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.MovieService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FavoriteMovieApplicationServiceImpl implements FavoriteMovieApplicationService {

    private final FavoriteMovieService favoriteMovieService;
    private final MovieService movieService;

    public FavoriteMovieApplicationServiceImpl(FavoriteMovieService favoriteMovieService, MovieService movieService) {
        this.favoriteMovieService = favoriteMovieService;
        this.movieService = movieService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisplayFavoriteMovieResponseDto> findAllByUser(User user) {
        return DisplayFavoriteMovieResponseDto.from(favoriteMovieService.findAllByUser(user));
    }

    @Override
    @Transactional
    public DisplayFavoriteMovieResponseDto add(User user, Integer tmdbId) {
        Movie movie = movieService.findOrCreateByTmdbId(tmdbId);
        FavoriteMovie favoriteMovie = favoriteMovieService.add(user, movie);
        return DisplayFavoriteMovieResponseDto.from(favoriteMovie);
    }

    @Override
    @Transactional
    public void remove(User user, Integer tmdbId) {
        Movie movie = movieService.findByTmdbId(tmdbId).orElseThrow(() -> new MovieNotFoundException(tmdbId));
        favoriteMovieService.remove(user, movie);
    }
}
