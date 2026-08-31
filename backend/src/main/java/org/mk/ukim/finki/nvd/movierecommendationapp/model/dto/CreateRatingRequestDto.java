package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CreateRatingRequestDto(
        @NotNull
        Integer tmdbId,

        @NotNull
        @DecimalMin(value="0.0", message="The score cant be below 0.0 (Even if the movie is that bad).")
        @DecimalMax(value="5.0", message="The score can go up to 5.0.")
        BigDecimal score,

        @Size(max=2000, message="Your review can be 2000 characters at most.")
        String review
) {
}
