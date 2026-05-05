package com.sakun.foodordering.controller;

import com.sakun.foodordering.dto.OrderDto;
import com.sakun.foodordering.dto.PageResponse;
import com.sakun.foodordering.entity.Order;
import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto.Response> placeOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OrderDto.PlaceOrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(user, request));
    }

    @GetMapping("/my")
    public ResponseEntity<PageResponse<OrderDto.Response>> getMyOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getMyOrders(user, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto.Response> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrderById(id, user));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderDto.Response> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.cancelOrder(id, user));
    }

    // Admin endpoints
    @GetMapping("/admin")
    public ResponseEntity<PageResponse<OrderDto.Response>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<OrderDto.Response> updateStatus(
            @PathVariable Long id,
            @RequestBody OrderDto.UpdateStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus()));
    }
}
