package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    Optional<User> findByUsername(String username);
    User register(User user);
    User login(String username, String password);
}
