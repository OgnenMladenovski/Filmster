package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class WatchlistNotFoundException extends RuntimeException {
    public WatchlistNotFoundException(Integer tmdbId) {
        super(String.format("You still haven't added the movie with the id %d to your watchlist.", tmdbId));
    }
}
