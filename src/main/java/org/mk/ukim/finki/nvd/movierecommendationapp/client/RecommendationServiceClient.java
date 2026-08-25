package org.mk.ukim.finki.nvd.movierecommendationapp.client;

import org.mk.ukim.finki.nvd.movierecommendationapp.client.dto.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RecommendationServiceClient {

    public TmdbRecommendationResponse recommend(TmdbRecommendationRequest request){
        List<TmdbCandidateMovieDto> candidates = request.candidates();
        int limit = Math.min(request.limit(), candidates.size());

        List<TmdbRecommendationItemDto> items = new ArrayList<>();

        for (int i = 0; i < limit; i++) {
            TmdbCandidateMovieDto candidate = candidates.get(i);
            items.add(new TmdbRecommendationItemDto(candidate.tmdbId(), i + 1, "Suggested because its similar to your movies"));
        }

        return new TmdbRecommendationResponse(items);
    }

}
