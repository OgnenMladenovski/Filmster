package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.FavoriteMovie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.FavoriteMovieAlreadyExistsException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.FavoriteMovieListIsFullException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.FavoriteMovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.FavoriteMovieRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.FavoriteMovieService;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.RecommendationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavoriteMovieServiceImpl implements FavoriteMovieService {

    private final FavoriteMovieRepository favoriteMovieRepository;
    private final RecommendationRepository recommendationRepository;
    private static final int MAX_FAVORITE_MOVIES = 5;

    public FavoriteMovieServiceImpl(FavoriteMovieRepository favoriteMovieRepository, RecommendationRepository recommendationRepository) {
        this.favoriteMovieRepository = favoriteMovieRepository;
        this.recommendationRepository = recommendationRepository;
    }

    @Override
    public List<FavoriteMovie> findAllByUser(User user) {
        return favoriteMovieRepository.findAllByUserIdOrderByIdAsc(user.getId());
    }

    @Override
    public FavoriteMovie add(User user, Movie movie) {
        if (favoriteMovieRepository.existsByUserIdAndMovieId(user.getId(), movie.getId()))
        {
            throw new FavoriteMovieAlreadyExistsException(movie.getTmdbId());
        }
        if (favoriteMovieRepository.countByUserId(user.getId()) >= MAX_FAVORITE_MOVIES)
        {
            throw new FavoriteMovieListIsFullException();
        }
        return favoriteMovieRepository.save(new FavoriteMovie(user, movie));
    }

    @Override
    public void remove(User user, Movie movie) {
        FavoriteMovie favoriteMovie = favoriteMovieRepository.findByUserIdAndMovieId(user.getId(), movie.getId()).orElseThrow(() -> new FavoriteMovieNotFoundException(movie.getTmdbId()));
        favoriteMovieRepository.delete(favoriteMovie);
        recommendationRepository.deleteAllByUser(user);
    }
}
