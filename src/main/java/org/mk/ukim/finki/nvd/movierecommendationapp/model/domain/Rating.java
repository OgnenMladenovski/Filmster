package org.mk.ukim.finki.nvd.movierecommendationapp.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name="ratings")
@Getter
@Setter
@NoArgsConstructor
public class Rating extends BaseAuditableEntity{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false)
    private BigDecimal score;

    private String review;

    public Rating(User user, Movie movie, BigDecimal score, String review) {
        this.user = user;
        this.movie = movie;
        this.score = score;
        this.review = review;
    }
}
