package com.sakun.foodordering.dto;

import com.sakun.foodordering.entity.Cart;
import com.sakun.foodordering.entity.CartItem;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

public class CartDto {

    @Data
    public static class AddItemRequest {
        private Long foodId;
        private int quantity;
    }

    @Data
    public static class UpdateItemRequest {
        private int quantity;
    }

    @Data
    public static class ItemResponse {
        private Long id;
        private FoodDto.Response food;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        public static ItemResponse from(CartItem item) {
            ItemResponse r = new ItemResponse();
            r.id = item.getId();
            r.food = FoodDto.Response.from(item.getFood());
            r.quantity = item.getQuantity();
            r.unitPrice = item.getFood().getPrice();
            r.totalPrice = item.getFood().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return r;
        }
    }

    @Data
    public static class Response {
        private Long id;
        private List<ItemResponse> items;
        private BigDecimal totalAmount;

        public static Response from(Cart cart) {
            Response r = new Response();
            r.id = cart.getId();
            r.items = cart.getItems().stream().map(ItemResponse::from).toList();
            r.totalAmount = r.items.stream()
                    .map(ItemResponse::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            return r;
        }
    }
}
