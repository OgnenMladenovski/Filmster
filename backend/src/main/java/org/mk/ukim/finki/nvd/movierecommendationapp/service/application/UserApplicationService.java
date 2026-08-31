package org.mk.ukim.finki.nvd.movierecommendationapp.service.application;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.LoginUserRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.LoginUserResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.RegisterUserRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.RegisterUserResponseDto;

import java.util.Optional;

public interface UserApplicationService {
    RegisterUserResponseDto register(RegisterUserRequestDto registerUserRequestDto);
    LoginUserResponseDto login(LoginUserRequestDto loginUserRequestDto);
    Optional<RegisterUserResponseDto> findByUsername(String username);
}
