package org.mk.ukim.finki.nvd.movierecommendationapp.client.dto;

import java.util.List;

public record TmdbSearchResponse(
        List<TmdbSearchResult> results
) {
}
