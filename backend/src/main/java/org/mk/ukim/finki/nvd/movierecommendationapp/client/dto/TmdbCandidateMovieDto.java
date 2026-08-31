package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbCandidateMovieDto(
        @JsonProperty("tmdb_id") Integer tmdbId,
        String title,
        String overview,
        Double rating
) {
}
