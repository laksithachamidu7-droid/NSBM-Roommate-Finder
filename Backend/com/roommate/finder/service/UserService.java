package com.roommate.finder.service;

import com.roommate.finder.dto.AuthRequest;
import com.roommate.finder.dto.AuthResponse;
import com.roommate.finder.dto.RegisterRequest;
import com.roommate.finder.dto.UserDto;
import com.roommate.finder.dto.UserProfileUpdate;
import com.roommate.finder.entity.User;
import com.roommate.finder.exception.ResourceNotFoundException;
import com.roommate.finder.repository.UserRepository;
import com.roommate.finder.config.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public UserDto registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .profileImage(request.getProfileImage())
                .userType(StringUtils.hasText(request.getUserType()) ? request.getUserType() : "renter")
                .companyName(request.getCompanyName())
                .build();

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return AuthResponse.builder()
                .token(jwt)
                .user(mapToDto(user))
                .build();
    }

    public UserDto getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDto(user);
    }

    public UserDto updateUserProfile(String email, UserProfileUpdate update) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(update.getName());
        user.setPhone(update.getPhone());
        user.setProfileImage(update.getProfileImage());

        if (StringUtils.hasText(update.getPassword())) {
            user.setPassword(passwordEncoder.encode(update.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserDto mapToDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .userType(user.getUserType())
                .companyName(user.getCompanyName())
                .build();
    }
}
