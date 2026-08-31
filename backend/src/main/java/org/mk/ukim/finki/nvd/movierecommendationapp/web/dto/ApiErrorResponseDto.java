package org.mk.ukim.finki.nvd.movierecommendationapp.web.dto;

import java.util.Date;

public record ApiErrorResponseDto(
        Date timestamp,
        int status,
        String error,
        String message,
        String path
) {
    public ApiErrorResponseDto(int status, String error, String message, String path)
    {
        this(new Date(), status, error, message, path);
    }
}
