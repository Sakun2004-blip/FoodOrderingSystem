package com.sakun.foodordering.service;

import com.sakun.foodordering.dto.FoodDto;
import com.sakun.foodordering.dto.PageResponse;
import com.sakun.foodordering.entity.Category;
import com.sakun.foodordering.entity.Food;
import com.sakun.foodordering.exception.ResourceNotFoundException;
import com.sakun.foodordering.repository.CategoryRepository;
import com.sakun.foodordering.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    public PageResponse<FoodDto.Response> getAll(String search, Long categoryId,
                                                  Boolean available, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return PageResponse.from(
                foodRepository.findWithFilters(search, categoryId, available, pageable)
                        .map(FoodDto.Response::from));
    }

    public FoodDto.Response getById(Long id) {
        return FoodDto.Response.from(findById(id));
    }

    public FoodDto.Response create(FoodDto.Request request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Food food = Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .available(request.isAvailable())
                .category(category)
                .build();
        return FoodDto.Response.from(foodRepository.save(food));
    }

    public FoodDto.Response update(Long id, FoodDto.Request request) {
        Food food = findById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setAvailable(request.isAvailable());
        food.setCategory(category);
        return FoodDto.Response.from(foodRepository.save(food));
    }

    public void delete(Long id) {
        findById(id);
        foodRepository.deleteById(id);
    }

    public FoodDto.Response toggleAvailability(Long id) {
        Food food = findById(id);
        food.setAvailable(!food.isAvailable());
        return FoodDto.Response.from(foodRepository.save(food));
    }

    private Food findById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
    }
}
