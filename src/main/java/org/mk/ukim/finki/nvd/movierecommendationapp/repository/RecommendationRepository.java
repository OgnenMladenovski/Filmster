package org.mk.ukim.finki.nvd.movierecommendationapp.repository;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.Recommendation;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findAllByUserOrderByRankAsc(User user);
    void deleteAllByUser(User user);
}
