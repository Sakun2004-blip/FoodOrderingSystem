package com.sakun.foodordering.service;

import com.sakun.foodordering.dto.CategoryDto;
import com.sakun.foodordering.entity.Category;
import com.sakun.foodordering.exception.BadRequestException;
import com.sakun.foodordering.exception.ResourceNotFoundException;
import com.sakun.foodordering.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto.Response> getAll() {
        return categoryRepository.findAll().stream().map(CategoryDto.Response::from).toList();
    }

    public CategoryDto.Response getById(Long id) {
        return CategoryDto.Response.from(findById(id));
    }

    public CategoryDto.Response create(CategoryDto.Request request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category name already exists");
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return CategoryDto.Response.from(categoryRepository.save(category));
    }

    public CategoryDto.Response update(Long id, CategoryDto.Request request) {
        Category category = findById(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return CategoryDto.Response.from(categoryRepository.save(category));
    }

    public void delete(Long id) {
        findById(id);
        categoryRepository.deleteById(id);
    }

    private Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }
}
