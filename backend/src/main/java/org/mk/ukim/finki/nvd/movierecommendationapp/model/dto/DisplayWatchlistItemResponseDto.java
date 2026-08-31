package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.WatchlistItem;
import java.util.List;

public record DisplayWatchlistItemResponseDto(
        Long id,
        DisplayMovieResponseDto movie
) {
    public static DisplayWatchlistItemResponseDto from(WatchlistItem watchlistItem)
    {
        return new DisplayWatchlistItemResponseDto(
                watchlistItem.getId(),
                DisplayMovieResponseDto.from(watchlistItem.getMovie())
        );
    }

    public static List<DisplayWatchlistItemResponseDto> from(List<WatchlistItem> watchlistItems)
    {
        return watchlistItems
                .stream()
                .map(DisplayWatchlistItemResponseDto::from)
                .toList();
    }
}
