package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import lombok.extern.slf4j.Slf4j;
import org.mk.ukim.finki.nvd.movierecommendationapp.client.TmdbClient;
import org.mk.ukim.finki.nvd.movierecommendationapp.client.dto.TmdbMovieResponse;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.MovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.MovieRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.GenreService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.MovieService;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final TmdbClient tmdbClient;
    private final GenreService genreService;

    public MovieServiceImpl(MovieRepository movieRepository, TmdbClient tmdbClient, GenreService genreService) {
        this.movieRepository = movieRepository;
        this.tmdbClient = tmdbClient;
        this.genreService = genreService;
    }

    @Override
    public Optional<Movie> findById(Long id) {
        return movieRepository.findById(id);
    }

    @Override
    public Optional<Movie> findByTmdbId(Integer tmdbId) {
        return movieRepository.findByTmdbId(tmdbId);
    }

    @Override
    public Movie findOrCreateByTmdbId(Integer tmdbId) {
        return movieRepository.findByTmdbId(tmdbId).orElseGet(() -> fetchAndSave(tmdbId));
    }

    private Movie fetchAndSave(Integer tmdbId)
    {
        TmdbMovieResponse response = tmdbClient.fetchMovie(tmdbId)
                .orElseThrow(() -> new MovieNotFoundException(tmdbId));

        Movie movie = new Movie(
                response.id(),
                response.title(),
                emptyToNull(response.overview()),
                parseDate(response.releaseDate()),
                response.runtime(),
                emptyToNull(response.posterPath()),
                emptyToNull(response.backdropPath()),
                response.voteAverage(),
                response.voteCount()
        );

        if (response.genres() != null) {
            response.genres().forEach(tmdbGenre ->
                    genreService.findByTmdbId(tmdbGenre.id()).ifPresentOrElse(
                            genre -> movie.getGenres().add(genre),
                            () -> log.warn("Unknown TMDB genre {} ({}) on movie {}",
                                    tmdbGenre.id(), tmdbGenre.name(), tmdbId)
                    )
            );
        }

        return movieRepository.save(movie);
    }

    private LocalDate parseDate(String value) {
        return (value == null || value.isBlank()) ? null : LocalDate.parse(value);
    }

    private String emptyToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
