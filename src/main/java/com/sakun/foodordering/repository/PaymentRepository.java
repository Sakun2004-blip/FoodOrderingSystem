package com.sakun.foodordering.repository;

import com.sakun.foodordering.entity.Payment;
import com.sakun.foodordering.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);

    @Query("SELECT p FROM Payment p WHERE p.order.user = :user ORDER BY p.paidAt DESC")
    List<Payment> findByUser(User user);
}
