package com.sakun.foodordering.controller;

import com.sakun.foodordering.dto.CategoryDto;
import com.sakun.foodordering.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto.Response>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @PostMapping("/admin")
    public ResponseEntity<CategoryDto.Response> create(@Valid @RequestBody CategoryDto.Request request) {
        return ResponseEntity.ok(categoryService.create(request));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<CategoryDto.Response> update(
            @PathVariable Long id, @Valid @RequestBody CategoryDto.Request request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
