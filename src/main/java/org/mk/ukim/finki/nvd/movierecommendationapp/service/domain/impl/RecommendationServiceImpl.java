package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mk.ukim.finki.nvd.movierecommendationapp.client.RecommendationServiceClient;
import org.mk.ukim.finki.nvd.movierecommendationapp.client.TmdbClient;
import org.mk.ukim.finki.nvd.movierecommendationapp.client.dto.*;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.FavoriteMovie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Recommendation;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.NotEnoughFavoriteMoviesException;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.RecommendationRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.FavoriteMovieService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.MovieService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.RecommendationService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final FavoriteMovieService favoriteMovieService;
    private final TmdbClient tmdbClient;
    private final RecommendationServiceClient recommendationServiceClient;
    private final MovieService movieService;

    @Override
    public List<Recommendation> findAllByUser(User user) {
        return recommendationRepository.findAllByUserOrderByRankAsc(user);
    }

    @Override
    public void generate(User user) throws NotEnoughFavoriteMoviesException {
        List<FavoriteMovie> favorites = favoriteMovieService.findAllByUser(user);
        if (favorites.size() != 5){
            throw new NotEnoughFavoriteMoviesException(favorites.size());
        }

        Map<Integer, TmdbSearchResult> poolByImdbId = new LinkedHashMap<>();

        for (FavoriteMovie m : favorites){
            List<TmdbSearchResult> similar = tmdbClient.fetchSimilar(m.getMovie().getTmdbId());
            for (TmdbSearchResult result : similar){
                poolByImdbId.putIfAbsent(result.id(), result);
            }
        }

        Set<Integer> favoriteTmdbIds = favorites.stream()
                .map(favorite -> favorite.getMovie().getTmdbId())
                .collect(Collectors.toSet());
        poolByImdbId.keySet().removeAll(favoriteTmdbIds);

        List<TmdbSearchResult> pool = new ArrayList<>(poolByImdbId.values());

        List<TmdbFavoriteMovieDto> favoriteMovieDtos = favorites.stream()
                .map(favorite -> new TmdbFavoriteMovieDto(
                        favorite.getMovie().getTmdbId(),
                        favorite.getMovie().getTitle(),
                        favorite.getMovie().getGenres().stream()
                                .map(genre -> genre.getName())
                                .collect(Collectors.toList())
                )).toList();


        List<TmdbCandidateMovieDto> candidateDtos = pool.stream()
                .map(result -> new TmdbCandidateMovieDto(
                        result.id(),
                        result.title(),
                        result.overview(),
                        result.voteAverage() != null ? result.voteAverage().doubleValue() : null
                )).toList();

        TmdbRecommendationRequest request = new TmdbRecommendationRequest(favoriteMovieDtos, candidateDtos, 10);
        TmdbRecommendationResponse response = recommendationServiceClient.recommend(request);

        List<Recommendation> newRecommendations = new ArrayList<>();
        for (TmdbRecommendationItemDto item : response.recommendations()){
            if (!poolByImdbId.containsKey(item.tmdbId())){
                continue;
            }
            Movie movie = movieService.findOrCreateByTmdbId(item.tmdbId());
            newRecommendations.add(new Recommendation(user, movie, item.rank(), item.reason()));
        }

        recommendationRepository.deleteAllByUser(user);
        recommendationRepository.saveAll(newRecommendations);
    }

    private List<TmdbRecommendationItemDto> buildFallbackRecommendations(List<TmdbSearchResult> pool, int limit){
        List<TmdbSearchResult> sorted = pool.stream()
                .sorted(Comparator.comparing(TmdbSearchResult::voteAverage, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(limit)
                .toList();

        List<TmdbRecommendationItemDto> result = new ArrayList<>();
        for (int i = 0; i < sorted.size(); i++) {
            result.add(new TmdbRecommendationItemDto(sorted.get(i).id(), i + 1, "Popular among similar movies"));
        }

        return result;
    }
}
