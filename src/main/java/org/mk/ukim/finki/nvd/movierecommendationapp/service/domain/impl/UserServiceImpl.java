package org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.impl;

import org.mk.ukim.finki.nvd.movierecommendationapp.model.domain.User;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.InvalidCredentialsException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.UserNotFoundException;
import org.mk.ukim.finki.nvd.movierecommendationapp.model.exception.UsernameAlreadyExistsException;
import org.mk.ukim.finki.nvd.movierecommendationapp.repository.UserRepository;
import org.mk.ukim.finki.nvd.movierecommendationapp.service.domain.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User register(User user) {
        if(userRepository.existsByUsername(user.getUsername()))
        {
            throw new UsernameAlreadyExistsException(user.getUsername());
        }
        User user1 = new User(user.getUsername(), user.getEmail(), passwordEncoder.encode(user.getPassword()), user.getRole());
        return userRepository.save(user1);
    }

    @Override
    public User login(String username, String password) {
        User user = userRepository.findByUsername(username).orElseThrow(InvalidCredentialsException::new);
        if(!passwordEncoder.matches(password, user.getPassword()))
        {
            throw new InvalidCredentialsException();
        }
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException(username));
    }
}
