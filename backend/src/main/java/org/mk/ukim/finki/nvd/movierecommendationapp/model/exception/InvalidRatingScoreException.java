package org.mk.ukim.finki.nvd.movierecommendationapp.model.exception;

import java.math.BigDecimal;

public class InvalidRatingScoreException extends RuntimeException {
    public InvalidRatingScoreException(BigDecimal score) {
        super(String.format("The score %s is invalid. Please use ratings from 0.5 to 5.0 in intervals of 0.5.", score));
    }
}
