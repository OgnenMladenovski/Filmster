package org.mk.ukim.finki.nvd.movierecommendationapp.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="movies")
@Getter
@Setter
@NoArgsConstructor
public class Movie extends BaseAuditableEntity {

    @Column(nullable = false, unique = true)
    private Integer tmdbId;

    @Column(nullable = false)
    private String title;

    private String overview;

    private LocalDate releaseDate;

    private Integer runtime;

    private String posterPath;

    private String backdropPath;

    private BigDecimal tmdbRating;

    private Integer tmdbVoteCount;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private Set<Genre> genres = new HashSet<>();

    public Movie(Integer tmdbId, String title, String overview, LocalDate releaseDate, Integer runtime, String posterPath, String backdropPath, BigDecimal tmdbRating, Integer tmdbVoteCount) {
        this.tmdbId = tmdbId;
        this.title = title;
        this.overview = overview;
        this.releaseDate = releaseDate;
        this.runtime = runtime;
        this.posterPath = posterPath;
        this.backdropPath = backdropPath;
        this.tmdbRating = tmdbRating;
        this.tmdbVoteCount = tmdbVoteCount;
    }
}