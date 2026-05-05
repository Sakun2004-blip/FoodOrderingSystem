package com.sakun.foodordering.repository;

import com.sakun.foodordering.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FoodRepository extends JpaRepository<Food, Long> {

    @Query("SELECT f FROM Food f WHERE " +
           "(:search IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR f.category.id = :categoryId) AND " +
           "(:available IS NULL OR f.available = :available)")
    Page<Food> findWithFilters(String search, Long categoryId, Boolean available, Pageable pageable);
}
