package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DisplayMovieDetailsResponseDto(
        Long id,
        Integer tmdbId,
        String title,
        String posterPath,
        LocalDate releaseDate,
        BigDecimal tmdbRating,
        String overview,
        Integer runtime,
        String backdropPath,
        Integer tmdbVoteCount,
        List<DisplayGenreResponseDto> genres
) {
    public static DisplayMovieDetailsResponseDto from(Movie movie)
    {
        return new DisplayMovieDetailsResponseDto(
                movie.getId(),
                movie.getTmdbId(),
                movie.getTitle(),
                movie.getPosterPath(),
                movie.getReleaseDate(),
                movie.getTmdbRating(),
                movie.getOverview(),
                movie.getRuntime(),
                movie.getBackdropPath(),
                movie.getTmdbVoteCount(),
                movie.getGenres().stream().map(DisplayGenreResponseDto::from).toList()
        );
    }
}
