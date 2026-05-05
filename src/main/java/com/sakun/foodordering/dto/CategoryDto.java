package com.sakun.foodordering.dto;

import com.sakun.foodordering.entity.Category;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CategoryDto {

    @Data
    public static class Request {
        @NotBlank private String name;
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;

        public static Response from(Category category) {
            Response r = new Response();
            r.id = category.getId();
            r.name = category.getName();
            r.description = category.getDescription();
            return r;
        }
    }
}
