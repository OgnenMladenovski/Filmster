package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class FavoriteMovieAlreadyExistsException extends RuntimeException {
    public FavoriteMovieAlreadyExistsException(Integer tmdbId) {
        super(String.format("The movie: %d is already in your favorite movies list.", tmdbId));
    }
}
