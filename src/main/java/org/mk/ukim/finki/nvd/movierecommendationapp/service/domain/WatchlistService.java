package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.WatchlistItem;

import java.util.List;

public interface WatchlistService {
    List<WatchlistItem> findAllByUser(User user);
    WatchlistItem add(User user, Movie movie);
    void remove(User user, Movie movie);
}
