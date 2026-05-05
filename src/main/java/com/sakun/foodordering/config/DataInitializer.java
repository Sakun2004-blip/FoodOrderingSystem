package com.sakun.foodordering.config;

import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@foodorder.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@foodorder.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin created: admin@foodorder.com / admin123");
        }
    }
}
