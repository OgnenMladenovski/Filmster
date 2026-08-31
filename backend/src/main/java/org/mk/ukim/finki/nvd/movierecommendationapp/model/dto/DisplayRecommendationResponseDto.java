package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Recommendation;

import java.util.List;

public record DisplayRecommendationResponseDto(
        Long id,
        DisplayMovieResponseDto movie,
        Integer rank,
        String reason
) {
    public static DisplayRecommendationResponseDto from(Recommendation recommendation)
    {
        return new DisplayRecommendationResponseDto(
                recommendation.getId(),
                DisplayMovieResponseDto.from(recommendation.getMovie()),
                recommendation.getRank(),
                recommendation.getReason()
        );
    }

    public static List<DisplayRecommendationResponseDto> from(List<Recommendation> recommendations)
    {
        return recommendations
                .stream()
                .map(DisplayRecommendationResponseDto::from)
                .toList();
    }
}



