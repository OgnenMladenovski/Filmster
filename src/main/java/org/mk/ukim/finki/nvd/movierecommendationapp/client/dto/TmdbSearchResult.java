package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record TmdbSearchResult(
        Integer id,
        String title,
        String overview,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("release_date") String releaseDate,
        @JsonProperty("vote_average") BigDecimal voteAverage
        ) {
}
