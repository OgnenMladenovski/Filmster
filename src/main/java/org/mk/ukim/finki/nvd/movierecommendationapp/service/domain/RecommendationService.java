package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Recommendation;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RecommendationService {
    List<Recommendation> findAllByUser(User user);
    void generate(User user);
}
