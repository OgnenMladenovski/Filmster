package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.InvalidCredentialsException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.UserNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.UsernameAlreadyExistsException;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class UserExceptionHandler extends AbstractExceptionHandler  {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponseDto> handleInvalidCredentialsException(
            InvalidCredentialsException invalidCredentialsException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.UNAUTHORIZED,
                invalidCredentialsException.getMessage(),
                request
        );
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponseDto> handleUsernameAlreadyExistsException(
            UsernameAlreadyExistsException usernameAlreadyExistsException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.CONFLICT,
                usernameAlreadyExistsException.getMessage(),
                request
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponseDto> handleUserNotFoundException(
            UserNotFoundException userNotFoundException,
            HttpServletRequest request
    ) {
        return buildResponse(
                HttpStatus.NOT_FOUND,
                userNotFoundException.getMessage(),
                request
        );
    }

}
