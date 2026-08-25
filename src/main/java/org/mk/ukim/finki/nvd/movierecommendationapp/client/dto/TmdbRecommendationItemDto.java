package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record TmdbRecommendationItemDto(
        @JsonProperty("tmdb_id") Integer tmdbId,
        Integer rank,
        String reason
) {

}
