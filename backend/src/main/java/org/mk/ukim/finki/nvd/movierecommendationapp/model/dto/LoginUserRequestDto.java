package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginUserRequestDto(
        @NotBlank
        String username,
        @NotBlank
        String password
) {
}
