package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.client.TmdbClient;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayMovieDetailsResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayMovieResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.MovieApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.MovieService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MovieApplicationServiceImpl implements MovieApplicationService {

    private final MovieService movieService;
    private final TmdbClient tmdbClient;

    public MovieApplicationServiceImpl(MovieService movieService, TmdbClient tmdbClient) {
        this.movieService = movieService;
        this.tmdbClient = tmdbClient;
    }

    @Override
    public List<DisplayMovieResponseDto> search(String query) {
        return tmdbClient.searchMovies(query).stream()
                .map(result -> new DisplayMovieResponseDto(
                        null,
                        result.id(),
                        result.title(),
                        result.posterPath(),
                        parseDate(result.releaseDate()),
                        result.voteAverage()
                ))
                .toList();
    }

    @Override
    @Transactional
    public DisplayMovieDetailsResponseDto findByTmdbId(Integer tmdbId) {
        return DisplayMovieDetailsResponseDto.from(movieService.findOrCreateByTmdbId(tmdbId));
    }

    private LocalDate parseDate(String value)
    {
        return (value == null || value.isBlank() ? null : LocalDate.parse(value));
    }

    @Override
    public List<DisplayMovieResponseDto> findByGenre(Integer genreTmdbId) {
        return tmdbClient.discoverByGenre(genreTmdbId).stream()
                .map(result -> new DisplayMovieResponseDto(
                        null,
                        result.id(),
                        result.title(),
                        result.posterPath(),
                        parseDate(result.releaseDate()),
                        result.voteAverage()
                ))
                .toList();
    }
}
