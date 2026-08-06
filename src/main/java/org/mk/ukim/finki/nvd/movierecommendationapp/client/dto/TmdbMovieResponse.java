package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public record TmdbMovieResponse(
        Integer id,
        String title,
        String overview,
        @JsonProperty("release_date") String releaseDate,
        Integer runtime,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("backdrop_path") String backdropPath,
        @JsonProperty("vote_average") BigDecimal voteAverage,
        @JsonProperty("vote_count") Integer voteCount,
        List<TmdbGenreResponse> genres
) {
}
