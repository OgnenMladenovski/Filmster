package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException(String username) {
        super(String.format("The username: %s already exists.", username));
    }
}
