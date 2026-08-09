package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayWatchlistItemResponseDto;
import java.util.List;

public interface WatchlistApplicationService {
    List<DisplayWatchlistItemResponseDto> findAllByUser(User user);
    DisplayWatchlistItemResponseDto add(User user, Integer tmdbId);
    void remove(User user, Integer tmdbId);
}
