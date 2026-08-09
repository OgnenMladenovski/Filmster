package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.WatchlistItem;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayWatchlistItemResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.MovieNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.WatchlistApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.MovieService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.WatchlistService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchlistApplicationServiceImpl implements WatchlistApplicationService {

    private final WatchlistService watchlistService;
    private final MovieService movieService;

    public WatchlistApplicationServiceImpl(WatchlistService watchlistService, MovieService movieService) {
        this.watchlistService = watchlistService;
        this.movieService = movieService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisplayWatchlistItemResponseDto> findAllByUser(User user) {
        return DisplayWatchlistItemResponseDto.from(watchlistService.findAllByUser(user));
    }

    @Override
    @Transactional
    public DisplayWatchlistItemResponseDto add(User user, Integer tmdbId) {
        Movie movie = movieService.findOrCreateByTmdbId(tmdbId);
        WatchlistItem watchlistItem = watchlistService.add(user, movie);
        return DisplayWatchlistItemResponseDto.from(watchlistItem);
    }

    @Override
    @Transactional
    public void remove(User user, Integer tmdbId) {
        Movie movie = movieService.findByTmdbId(tmdbId).orElseThrow(() -> new MovieNotFoundException(tmdbId));
        watchlistService.remove(user, movie);
    }
}
