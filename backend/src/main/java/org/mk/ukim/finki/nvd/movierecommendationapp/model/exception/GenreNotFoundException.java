package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class GenreNotFoundException extends RuntimeException {
    public GenreNotFoundException(Long genreId) {
        super(String.format("Genre with id %d does not exist.", genreId));
    }
}
