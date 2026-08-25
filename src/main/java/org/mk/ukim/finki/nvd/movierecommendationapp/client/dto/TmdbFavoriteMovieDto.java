package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TmdbFavoriteMovieDto(
        @JsonProperty("tmdb_id") Integer tmdbId,
        String title,
        List<String> genres
) {

}
