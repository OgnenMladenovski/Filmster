package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.WatchlistItem;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.WatchlistNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.WatchlistRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.WatchlistService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistServiceImpl implements WatchlistService {

    private final WatchlistRepository watchlistRepository;

    public WatchlistServiceImpl(WatchlistRepository watchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    @Override
    public List<WatchlistItem> findAllByUser(User user) {
        return watchlistRepository.findAllByUserId(user.getId());
    }

    @Override
    public WatchlistItem add(User user, Movie movie) {
        return watchlistRepository.findByUserIdAndMovieId(user.getId(), movie.getId()).orElseGet(() -> watchlistRepository.save(new WatchlistItem(user, movie)));
    }

    @Override
    public void remove(User user, Movie movie) {
        WatchlistItem watchlistItem = watchlistRepository.findByUserIdAndMovieId(user.getId(), movie.getId()).orElseThrow(() -> new WatchlistNotFoundException(movie.getTmdbId()));
        watchlistRepository.delete(watchlistItem);
    }
}
