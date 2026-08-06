package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class JwtExceptionHandler extends AbstractExceptionHandler{

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiErrorResponseDto> handleExpiredJwtException(
            ExpiredJwtException exception,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "The token has expired.", request);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ApiErrorResponseDto> handleSignatureException(
            SignatureException exception,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "The token's signature is invalid.", request);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorResponseDto> handleJwtException(
            JwtException exception,
            HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "The token is invalid.", request);
    }
}


