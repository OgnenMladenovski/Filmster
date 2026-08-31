package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class NotEnoughFavoriteMoviesException extends RuntimeException{
    public NotEnoughFavoriteMoviesException(int count) {
        super(String.format(
                "You need exactly 5 favorite movies to generate recommendations. You currently have %d.", count)
        );
    }

}
