package org.mk.ukim.finki.nvd.movierecommendationapp.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="watchlist_items")
@Getter
@Setter
@NoArgsConstructor
public class WatchlistItem extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    public WatchlistItem(User user, Movie movie) {
        this.user = user;
        this.movie = movie;
    }
}
