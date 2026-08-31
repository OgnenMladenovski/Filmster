package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.MovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MovieExceptionHandler extends AbstractExceptionHandler{

    @ExceptionHandler(MovieNotFoundException.class)
    public ResponseEntity<ApiErrorResponseDto> handleMovieNotFoundException(
            MovieNotFoundException movieNotFoundException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                movieNotFoundException.getMessage(),
                request
        );
    }

}
