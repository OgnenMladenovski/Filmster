package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Genre;

import java.util.List;

public record DisplayGenreResponseDto(
        Long id,
        Integer tmdbId,
        String name
) {
    public static DisplayGenreResponseDto from(Genre genre)
    {
        return new DisplayGenreResponseDto(
                genre.getId(),
                genre.getTmdbId(),
                genre.getName()
        );
    }

    public static List<DisplayGenreResponseDto> from(List<Genre> genres)
    {
        return genres
                .stream()
                .map(DisplayGenreResponseDto::from)
                .toList();
    }
}
