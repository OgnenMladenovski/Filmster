package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super(String.format("User with username: %s was not found.", username));
    }
}
