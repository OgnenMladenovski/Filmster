package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Recommendation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DisplayMovieResponseDto(
        Long id,
        Integer tmdbId,
        String title,
        String posterPath,
        LocalDate releaseDate,
        BigDecimal tmdbRating
) {
    public static DisplayMovieResponseDto from(Movie movie) {
        return new DisplayMovieResponseDto(
                movie.getId(),
                movie.getTmdbId(),
                movie.getTitle(),
                movie.getPosterPath(),
                movie.getReleaseDate(),
                movie.getTmdbRating()
        );
    }

    public static List<DisplayMovieResponseDto> from(List<Movie> movies) {
        return movies
                .stream()
                .map(DisplayMovieResponseDto::from)
                .toList();
    }
}
