package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.DisplayGenreResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.GenreNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.GenreApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreApplicationService genreApplicationService;

    public GenreController(GenreApplicationService genreApplicationService) {
        this.genreApplicationService = genreApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<DisplayGenreResponseDto>> findAll() {
        return ResponseEntity.ok(genreApplicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayGenreResponseDto> findById(@PathVariable Long id) {
        return genreApplicationService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new GenreNotFoundException(id));
    }
}
