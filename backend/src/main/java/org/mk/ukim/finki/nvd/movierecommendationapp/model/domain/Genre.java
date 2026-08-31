package org.mk.ukim.finki.nvd.movierecommendationapp.model.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="genres")
@Getter
@Setter
@NoArgsConstructor
public class Genre extends BaseEntity {

    @Column(nullable = false, unique = true)
    private Integer tmdbId;

    @Column(nullable = false)
    private String name;

    public Genre(Integer tmdbId, String name) {
        this.tmdbId = tmdbId;
        this.name = name;
    }
}
