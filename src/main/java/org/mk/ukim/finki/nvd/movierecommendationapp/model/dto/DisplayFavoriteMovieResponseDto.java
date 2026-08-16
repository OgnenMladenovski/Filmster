package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.FavoriteMovie;

import java.util.List;

public record DisplayFavoriteMovieResponseDto(
        Long id,
        DisplayMovieResponseDto movie
) {
    public static DisplayFavoriteMovieResponseDto from(FavoriteMovie favoriteMovie)
    {
        return new DisplayFavoriteMovieResponseDto(
                favoriteMovie.getId(),
                DisplayMovieResponseDto.from(favoriteMovie.getMovie())
        );
    }

    public static List<DisplayFavoriteMovieResponseDto> from(List<FavoriteMovie> favoriteMovies)
    {
        return favoriteMovies
                .stream()
                .map(DisplayFavoriteMovieResponseDto::from)
                .toList();
    }
}
