package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class MovieNotFoundException extends RuntimeException {
    public MovieNotFoundException(Integer tmdbId) {
        super(String.format("Movie with id %d does not exist.", tmdbId));
    }
}
