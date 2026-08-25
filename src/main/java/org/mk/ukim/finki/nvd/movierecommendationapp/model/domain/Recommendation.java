package org.mk.ukim.finki.nvd.movierecommendationapp.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="recommendations")
@Getter
@Setter
@NoArgsConstructor
public class Recommendation extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false)
    private Integer rank;

    @Column(nullable = false)
    private String reason;

    public Recommendation(User user, Movie movie, int rank, String reason) {
        this.user = user;
        this.movie = movie;
        this.rank = rank;
        this.reason = reason;
    }
}
