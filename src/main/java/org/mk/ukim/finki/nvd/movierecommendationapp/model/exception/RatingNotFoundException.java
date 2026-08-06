package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class RatingNotFoundException extends RuntimeException {
    public RatingNotFoundException(Integer tmdbId) {
        super(String.format("You still haven't rated the movie with the id %d.", tmdbId));
    }
}
