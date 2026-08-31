package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.FavoriteMovie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Movie;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import java.util.List;

public interface FavoriteMovieService {
    List<FavoriteMovie> findAllByUser(User user);
    FavoriteMovie add(User user, Movie movie);
    void remove(User user, Movie movie);
}
