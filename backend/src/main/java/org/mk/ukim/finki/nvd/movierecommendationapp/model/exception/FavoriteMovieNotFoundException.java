package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class FavoriteMovieNotFoundException extends RuntimeException {
    public FavoriteMovieNotFoundException(Integer tmdbId) {
        super(String.format("The movie with the id: %d isn't in your favorite movies.", tmdbId));
    }
}
