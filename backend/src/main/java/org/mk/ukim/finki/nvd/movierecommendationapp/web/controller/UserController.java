package org.mk.ukim.finki.nvd.movierecommendationapp.web.controller;

import jakarta.validation.Valid;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.LoginUserRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.LoginUserResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.RegisterUserRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.RegisterUserResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.UserApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponseDto> register(@Valid @RequestBody RegisterUserRequestDto registerUserRequestDto) {
        return ResponseEntity.ok(userApplicationService.register(registerUserRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponseDto> login(@Valid @RequestBody LoginUserRequestDto loginUserRequestDto) {
        return ResponseEntity.ok(userApplicationService.login(loginUserRequestDto));
    }

    @GetMapping("/me")
    public ResponseEntity<RegisterUserResponseDto> me(@AuthenticationPrincipal User user) {
        return userApplicationService
                .findByUsername(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
