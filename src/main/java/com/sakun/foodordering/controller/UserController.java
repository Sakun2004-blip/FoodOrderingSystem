package com.sakun.foodordering.controller;

import com.sakun.foodordering.dto.AuthDto;
import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<AuthDto.UserDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthDto.UserDto> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AuthDto.UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(user, request));
    }

    @PostMapping("/profile/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AuthDto.ChangePasswordRequest request) {
        userService.changePassword(user, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<AuthDto.UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User user) {
        userService.deleteUser(id, user);
        return ResponseEntity.noContent().build();
    }
}
