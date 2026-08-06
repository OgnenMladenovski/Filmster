package org.mk.ukim.finki.nvd.movierecommendationapp.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.enums.Role;

public record RegisterUserRequestDto(
        @NotBlank
        String username,
        @NotBlank
        @Email
        String email,
        @NotBlank
        @Size(min=8, message="Password must be at least 8 characters long.")
        String password
) {
    public User toUser(Role role)
    {
        return new User(username, email, password, role);
    }
}
