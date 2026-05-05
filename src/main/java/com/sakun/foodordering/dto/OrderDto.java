package com.sakun.foodordering.dto;

import com.sakun.foodordering.entity.Order;
import com.sakun.foodordering.entity.OrderItem;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    public static class PlaceOrderRequest {
        @NotBlank private String deliveryAddress;
    }

    @Data
    public static class UpdateStatusRequest {
        private Order.OrderStatus status;
    }

    @Data
    public static class ItemResponse {
        private Long id;
        private FoodDto.Response food;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public static ItemResponse from(OrderItem item) {
            ItemResponse r = new ItemResponse();
            r.id = item.getId();
            r.food = FoodDto.Response.from(item.getFood());
            r.quantity = item.getQuantity();
            // In current schema, OrderItem.price stores line total for the item.
            r.totalPrice = item.getPrice();
            if (item.getQuantity() > 0) {
                r.unitPrice = item.getPrice().divide(BigDecimal.valueOf(item.getQuantity()), 2, java.math.RoundingMode.HALF_UP);
            } else {
                r.unitPrice = BigDecimal.ZERO;
            }
            return r;
        }
    }

    @Data
    public static class Response {
        private Long id;
        private AuthDto.UserDto user;
        private List<ItemResponse> items;
        private BigDecimal totalAmount;
        private String status;
        private String deliveryAddress;
        private LocalDateTime createdAt;
        private PaymentDto.Response payment;

        public static Response from(Order order) {
            Response r = new Response();
            r.id = order.getId();
            r.user = AuthDto.UserDto.from(order.getUser());
            r.items = order.getItems().stream().map(ItemResponse::from).toList();
            r.totalAmount = order.getTotalAmount();
            r.status = order.getStatus().name();
            r.deliveryAddress = order.getDeliveryAddress();
            r.createdAt = order.getCreatedAt();
            if (order.getPayment() != null) {
                r.payment = PaymentDto.Response.from(order.getPayment());
            }
            return r;
        }
    }
}
