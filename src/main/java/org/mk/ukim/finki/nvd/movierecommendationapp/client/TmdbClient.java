package org.mk.ukim.finki.nvd.movierecommendationapp.client;

import org.mk.ukim.finki.nvd.movierecommendationapp.client.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

@Component
public class TmdbClient {

    private final RestClient restClient;
    private final String apiKey;

    public TmdbClient(@Value("${tmdb.base-url}") String baseUrl, @Value("${tmdb.api-key}") String apiKey) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

    public Optional<TmdbMovieResponse> fetchMovie(Integer tmdbId) {
        try {
            TmdbMovieResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/{id}")
                            .queryParam("api_key", apiKey)
                            .build(tmdbId))
                    .retrieve()
                    .body(TmdbMovieResponse.class);
            return Optional.ofNullable(response);
        } catch (HttpClientErrorException.NotFound exception) {
            return Optional.empty();
        }
    }

    public List<TmdbSearchResult> searchMovies(String query) {
        TmdbSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search/movie")
                            .queryParam("api_key", apiKey)
                            .queryParam("query", query)
                            .build())
                    .retrieve()
                    .body(TmdbSearchResponse.class);

        if (response == null || response.results() == null)
        {
            return  List.of();
        }
        return response.results();
    }

    public List<TmdbSearchResult> fetchSimilar(Integer tmdbId){
        TmdbSearchResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}/similar")
                        .queryParam("api_key", apiKey)
                        .build(tmdbId))
                .retrieve()
                .body(TmdbSearchResponse.class);

        if ((response == null) || response.results() == null){
                return List.of();
        }

        return response.results();
    }

    public List<TmdbCastMember> fetchCast(Integer tmdbId){
        TmdbCreditsResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}/credits")
                        .queryParam("api_key", apiKey)
                        .build(tmdbId))
                .retrieve()
                .body(TmdbCreditsResponse.class);

        if ((response == null) || response.cast() == null){
            return List.of();
        }
        return response.cast();
    }

    public List<TmdbSearchResult> discoverByGenre(Integer genreTmdbId) {
        TmdbSearchResponse response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_genres", genreTmdbId)
                        .build())
                .retrieve()
                .body(TmdbSearchResponse.class);

        if (response == null || response.results() == null) {
            return List.of();
        }
        return response.results();
    }
}
