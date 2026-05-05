package com.sakun.foodordering.service;

import com.sakun.foodordering.dto.AuthDto;
import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.exception.BadRequestException;
import com.sakun.foodordering.exception.ResourceNotFoundException;
import com.sakun.foodordering.repository.UserRepository;
import com.sakun.foodordering.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(User.Role.ROLE_USER)
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthDto.AuthResponse(token, AuthDto.UserDto.from(user));
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = jwtService.generateToken(user);
        return new AuthDto.AuthResponse(token, AuthDto.UserDto.from(user));
    }

    public AuthDto.UserDto getProfile(User currentUser) {
        return AuthDto.UserDto.from(currentUser);
    }

    public AuthDto.UserDto updateProfile(User currentUser, AuthDto.UpdateProfileRequest request) {
        currentUser.setName(request.getName());
        currentUser.setPhone(request.getPhone());
        currentUser.setAddress(request.getAddress());
        return AuthDto.UserDto.from(userRepository.save(currentUser));
    }

    public void changePassword(User currentUser, AuthDto.ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    public List<AuthDto.UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(AuthDto.UserDto::from).toList();
    }

    public void deleteUser(Long id, User currentUser) {
        if (id.equals(currentUser.getId())) {
            throw new BadRequestException("Cannot delete your own account");
        }
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
