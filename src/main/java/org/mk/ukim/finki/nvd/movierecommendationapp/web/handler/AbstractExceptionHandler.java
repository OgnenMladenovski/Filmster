package org.mk.ukim.finki.nvd.movierecommendationapp.web.handler;

import jakarta.servlet.http.HttpServletRequest;
import org.mk.ukim.finki.nvd.movierecommendationapp.web.dto.ApiErrorResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

abstract class AbstractExceptionHandler {
    protected ResponseEntity<ApiErrorResponseDto> buildResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        return new ResponseEntity<>(
                new ApiErrorResponseDto(
                        status.value(),
                        status.getReasonPhrase(),
                        message,
                        request.getRequestURI()
                ),
                status
        );
    }
}
