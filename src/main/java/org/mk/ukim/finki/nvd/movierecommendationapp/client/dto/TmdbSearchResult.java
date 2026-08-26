package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public record TmdbSearchResult(
        Integer id,
        String title,
        String overview,
        @JsonProperty("genre_ids") List<Integer> genre_ids,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("release_date") String releaseDate,
        @JsonProperty("vote_average") BigDecimal voteAverage
        ) {
}
