package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.enums.Role;

public record RegisterUserResponseDto(
        String username,
        String email,
        Role role
) {
    public static RegisterUserResponseDto from(User user)
    {
        return new RegisterUserResponseDto(
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}
