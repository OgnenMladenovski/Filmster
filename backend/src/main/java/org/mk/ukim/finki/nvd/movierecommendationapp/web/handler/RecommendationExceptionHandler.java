package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.NotEnoughFavoriteMoviesException;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RecommendationExceptionHandler extends AbstractExceptionHandler{

    @ExceptionHandler(NotEnoughFavoriteMoviesException.class)
    public ResponseEntity<ApiErrorResponseDto> handleNotEnoughFavoriteMoviesException(
            NotEnoughFavoriteMoviesException notEnoughFavoriteMoviesException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                notEnoughFavoriteMoviesException.getMessage(),
                request
        );
    }
}
