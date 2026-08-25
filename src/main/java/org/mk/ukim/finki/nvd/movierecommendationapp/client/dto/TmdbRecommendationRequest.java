package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import java.util.List;

public record TmdbRecommendationRequest(
        List<TmdbFavoriteMovieDto> favorites,
        List<TmdbCandidateMovieDto> candidates,
        Integer limit
) {
}
