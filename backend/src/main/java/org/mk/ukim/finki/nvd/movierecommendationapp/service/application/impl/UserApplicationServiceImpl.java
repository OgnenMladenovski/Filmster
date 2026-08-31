package org.mk.ukim.finki.nvd.movierecommendationapp.service.application.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.helper.JwtHelper;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.LoginUserRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.LoginUserResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.RegisterUserRequestDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.dto.RegisterUserResponseDto;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.enums.Role;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.application.UserApplicationService;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.UserService;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;
    private final JwtHelper jwtHelper;

    public UserApplicationServiceImpl(UserService userService, JwtHelper jwtHelper) {
        this.userService = userService;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public RegisterUserResponseDto register(RegisterUserRequestDto registerUserRequestDto) {
        User user = userService.register(registerUserRequestDto.toUser(Role.ROLE_USER));
        return RegisterUserResponseDto.from(user);
    }

    @Override
    public LoginUserResponseDto login(LoginUserRequestDto loginUserRequestDto) {
        User user = userService.login(loginUserRequestDto.username(), loginUserRequestDto.password());
        String token = jwtHelper.generateToken(user);
        return new LoginUserResponseDto(token);
    }

    @Override
    public Optional<RegisterUserResponseDto> findByUsername(String username) {
        return userService.findByUsername(username)
                .map(RegisterUserResponseDto::from);
    }
}
