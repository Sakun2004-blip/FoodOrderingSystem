package com.sakun.foodordering.controller;

import com.sakun.foodordering.dto.FoodDto;
import com.sakun.foodordering.dto.PageResponse;
import com.sakun.foodordering.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<PageResponse<FoodDto.Response>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(foodService.getAll(search, categoryId, available, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getById(id));
    }

    @PostMapping("/admin")
    public ResponseEntity<FoodDto.Response> create(@Valid @RequestBody FoodDto.Request request) {
        return ResponseEntity.ok(foodService.create(request));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<FoodDto.Response> update(
            @PathVariable Long id, @Valid @RequestBody FoodDto.Request request) {
        return ResponseEntity.ok(foodService.update(id, request));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        foodService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/{id}/toggle-availability")
    public ResponseEntity<FoodDto.Response> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.toggleAvailability(id));
    }
}
