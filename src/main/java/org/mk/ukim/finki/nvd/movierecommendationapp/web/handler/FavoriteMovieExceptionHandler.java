package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.FavoriteMovieAlreadyExistsException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.FavoriteMovieListIsFullException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.FavoriteMovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class FavoriteMovieExceptionHandler extends AbstractExceptionHandler{

    @ExceptionHandler(FavoriteMovieNotFoundException.class)
    public ResponseEntity<ApiErrorResponseDto> handleFavoriteMovieNotFoundException(
            FavoriteMovieNotFoundException favoriteMovieNotFoundException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                favoriteMovieNotFoundException.getMessage(),
                request
        );
    }

    @ExceptionHandler(FavoriteMovieListIsFullException.class)
    public ResponseEntity<ApiErrorResponseDto> handleFavoriteMovieListIsFullException(
            FavoriteMovieListIsFullException favoriteMovieListIsFullException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                favoriteMovieListIsFullException.getMessage(),
                request
        );
    }

    @ExceptionHandler(FavoriteMovieAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponseDto> handleFavoriteMovieAlreadyExistsException(
            FavoriteMovieAlreadyExistsException favoriteMovieAlreadyExistsException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                favoriteMovieAlreadyExistsException.getMessage(),
                request
        );
    }
}
