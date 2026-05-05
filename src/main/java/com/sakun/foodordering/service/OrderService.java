package com.sakun.foodordering.service;

import com.sakun.foodordering.dto.OrderDto;
import com.sakun.foodordering.dto.PageResponse;
import com.sakun.foodordering.entity.*;
import com.sakun.foodordering.exception.BadRequestException;
import com.sakun.foodordering.exception.ResourceNotFoundException;
import com.sakun.foodordering.repository.CartRepository;
import com.sakun.foodordering.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Transactional
    public OrderDto.Response placeOrder(User user, OrderDto.PlaceOrderRequest request) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Order order = Order.builder()
                .user(user)
                .deliveryAddress(request.getDeliveryAddress())
                .status(Order.OrderStatus.PENDING)
                .build();

        List<OrderItem> items = cart.getItems().stream().map(cartItem -> {
            BigDecimal price = cartItem.getFood().getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            return OrderItem.builder()
                    .order(order)
                    .food(cartItem.getFood())
                    .quantity(cartItem.getQuantity())
                    .price(price)
                    .build();
        }).toList();

        order.setItems(items);
        order.setTotalAmount(items.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add));

        Order saved = orderRepository.save(order);

        // Clear cart after order placed
        cart.getItems().clear();
        cartRepository.save(cart);

        return OrderDto.Response.from(saved);
    }

    public PageResponse<OrderDto.Response> getMyOrders(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return PageResponse.from(
                orderRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                        .map(OrderDto.Response::from));
    }

    public OrderDto.Response getOrderById(Long id, User user) {
        Order order = findById(id);
        if (!order.getUser().getId().equals(user.getId())
                && user.getRole() != User.Role.ROLE_ADMIN) {
            throw new BadRequestException("Access denied");
        }
        return OrderDto.Response.from(order);
    }

    public PageResponse<OrderDto.Response> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return PageResponse.from(
                orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                        .map(OrderDto.Response::from));
    }

    @Transactional
    public OrderDto.Response updateStatus(Long id, Order.OrderStatus status) {
        Order order = findById(id);
        order.setStatus(status);
        return OrderDto.Response.from(orderRepository.save(order));
    }

    @Transactional
    public OrderDto.Response cancelOrder(Long id, User user) {
        Order order = findById(id);
        if (!order.getUser().getId().equals(user.getId())
                && user.getRole() != User.Role.ROLE_ADMIN) {
            throw new BadRequestException("Access denied");
        }
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered order");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        return OrderDto.Response.from(orderRepository.save(order));
    }

    private Order findById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }
}
