package org.mk.ukim.finki.nvd.movierecommendationapp.client;

import org.mk.ukim.finki.nvd.movierecommendationapp.client.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class RecommendationServiceClient {

    private final RestClient restClient;

    public RecommendationServiceClient(@Value("${recommendation.service.url}") String baseUrl){
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000);
        requestFactory.setReadTimeout(60000);

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public TmdbRecommendationResponse recommend(TmdbRecommendationRequest request){
        return restClient.post()
                .uri("/recommend")
                .body(request)
                .retrieve()
                .body(TmdbRecommendationResponse.class);
    }

}
