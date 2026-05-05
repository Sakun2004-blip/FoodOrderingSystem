package com.sakun.foodordering.repository;

import com.sakun.foodordering.entity.Cart;
import com.sakun.foodordering.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
