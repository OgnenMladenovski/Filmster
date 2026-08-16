package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class WatchlistNotFoundException extends RuntimeException {
    public WatchlistNotFoundException(Integer tmdbId) {
        super(String.format("The movie with the id: %d hasn't been your watchlist.", tmdbId));
    }
}
