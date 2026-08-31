package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Invalid username or password.");
    }
}
