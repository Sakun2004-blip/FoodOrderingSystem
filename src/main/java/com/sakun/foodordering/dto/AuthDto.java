package com.sakun.foodordering.dto;

import com.sakun.foodordering.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String name;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 8)
        private String password;
        private String phone;
        private String address;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private UserDto user;

        public AuthResponse(String token, UserDto user) {
            this.token = token;
            this.user = user;
        }
    }

    @Data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String role;

        public static UserDto from(User user) {
            UserDto dto = new UserDto();
            dto.id = user.getId();
            dto.name = user.getName();
            dto.email = user.getEmail();
            dto.phone = user.getPhone();
            dto.address = user.getAddress();
            dto.role = user.getRole().name();
            return dto;
        }
    }

    @Data
    public static class UpdateProfileRequest {
        @NotBlank private String name;
        private String phone;
        private String address;
    }

    @Data
    public static class ChangePasswordRequest {
        @NotBlank private String currentPassword;
        @NotBlank @Size(min = 8) private String newPassword;
    }
}
