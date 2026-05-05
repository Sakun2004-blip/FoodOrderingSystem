package com.sakun.foodordering.controller;

import com.sakun.foodordering.dto.PaymentDto;
import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentDto.Response> processPayment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PaymentDto.Request request) {
        return ResponseEntity.ok(paymentService.processPayment(user, request));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDto.Response> getByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getByOrder(orderId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PaymentDto.Response>> getMyPayments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(paymentService.getMyPayments(user));
    }
}
