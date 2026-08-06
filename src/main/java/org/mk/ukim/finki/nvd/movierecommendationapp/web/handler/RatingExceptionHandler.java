package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.InvalidRatingScoreException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.RatingNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RatingExceptionHandler extends AbstractExceptionHandler {

    @ExceptionHandler(InvalidRatingScoreException.class)
    public ResponseEntity<ApiErrorResponseDto> handleInvalidRatingScoreException(
            InvalidRatingScoreException invalidRatingScoreException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                invalidRatingScoreException.getMessage(),
                request
        );
    }

    @ExceptionHandler(RatingNotFoundException.class)
    public ResponseEntity<ApiErrorResponseDto> handleRatingNotFoundException(
            RatingNotFoundException ratingNotFoundException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                ratingNotFoundException.getMessage(),
                request
        );
    }
}
