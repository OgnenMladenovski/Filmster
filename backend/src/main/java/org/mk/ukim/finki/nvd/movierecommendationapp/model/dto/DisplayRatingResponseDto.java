package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Rating;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record DisplayRatingResponseDto(
        Long id,
        DisplayMovieResponseDto movie,
        BigDecimal score,
        String review,
        LocalDateTime ratedAt
) {
    public static DisplayRatingResponseDto from(Rating rating)
    {
        return new DisplayRatingResponseDto(
                rating.getId(),
                DisplayMovieResponseDto.from(rating.getMovie()),
                rating.getScore(),
                rating.getReview(),
                rating.getCreatedAt()
        );
    }

    public static List<DisplayRatingResponseDto> from(List<Rating> ratings)
    {
        return ratings
                .stream()
                .map(DisplayRatingResponseDto::from)
                .toList();
    }
}
