package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class FavoriteMovieListIsFullException extends RuntimeException {
    public FavoriteMovieListIsFullException() {
        super("You have already added 5 movies to your favorites list, to add a different one you must remove one first.");
    }
}
