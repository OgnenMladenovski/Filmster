package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbRatedMovieDto(
        @JsonProperty("tmdb_id") Integer tmdbId,
        String title,
        Double score
) {
}
