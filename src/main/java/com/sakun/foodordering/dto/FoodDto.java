package com.sakun.foodordering.dto;

import com.sakun.foodordering.entity.Food;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

public class FoodDto {

    @Data
    public static class Request {
        @NotBlank private String name;
        private String description;
        @NotNull @DecimalMin("0.01") private BigDecimal price;
        private String imageUrl;
        private boolean available = true;
        @NotNull private Long categoryId;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String imageUrl;
        private boolean available;
        private CategoryDto.Response category;

        public static Response from(Food food) {
            Response r = new Response();
            r.id = food.getId();
            r.name = food.getName();
            r.description = food.getDescription();
            r.price = food.getPrice();
            r.imageUrl = food.getImageUrl();
            r.available = food.isAvailable();
            if (food.getCategory() != null) {
                r.category = CategoryDto.Response.from(food.getCategory());
            }
            return r;
        }
    }
}
