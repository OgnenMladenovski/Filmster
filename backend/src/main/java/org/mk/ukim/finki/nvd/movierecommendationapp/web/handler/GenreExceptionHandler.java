package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.GenreNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GenreExceptionHandler extends AbstractExceptionHandler {

    @ExceptionHandler(GenreNotFoundException.class)
    public ResponseEntity<ApiErrorResponseDto> handleGenreNotFoundException(
            GenreNotFoundException genreNotFoundException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                genreNotFoundException.getMessage(),
                request
        );
    }

}
