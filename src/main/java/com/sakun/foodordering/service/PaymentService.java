package com.sakun.foodordering.service;

import com.sakun.foodordering.dto.PaymentDto;
import com.sakun.foodordering.entity.Order;
import com.sakun.foodordering.entity.Payment;
import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.exception.BadRequestException;
import com.sakun.foodordering.exception.ResourceNotFoundException;
import com.sakun.foodordering.repository.OrderRepository;
import com.sakun.foodordering.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public PaymentDto.Response processPayment(User user, PaymentDto.Request request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot pay for a cancelled order");
        }
        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new BadRequestException("Payment already processed for this order");
        }

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(request.getMethod())
                .status(Payment.PaymentStatus.COMPLETED)
                .build();

        Payment saved = paymentRepository.save(payment);

        // Confirm the order after payment
        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        return PaymentDto.Response.from(saved);
    }

    public PaymentDto.Response getByOrder(Long orderId) {
        return PaymentDto.Response.from(
                paymentRepository.findByOrderId(orderId)
                        .orElseThrow(() -> new ResourceNotFoundException("Payment not found")));
    }

    public List<PaymentDto.Response> getMyPayments(User user) {
        return paymentRepository.findByUser(user).stream()
                .map(PaymentDto.Response::from).toList();
    }
}
