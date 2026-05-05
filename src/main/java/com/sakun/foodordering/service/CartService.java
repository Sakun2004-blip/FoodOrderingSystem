package com.sakun.foodordering.service;

import com.sakun.foodordering.dto.CartDto;
import com.sakun.foodordering.entity.Cart;
import com.sakun.foodordering.entity.CartItem;
import com.sakun.foodordering.entity.Food;
import com.sakun.foodordering.entity.User;
import com.sakun.foodordering.exception.BadRequestException;
import com.sakun.foodordering.exception.ResourceNotFoundException;
import com.sakun.foodordering.repository.CartRepository;
import com.sakun.foodordering.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final FoodRepository foodRepository;

    public CartDto.Response getCart(User user) {
        Cart cart = getOrCreateCart(user);
        return CartDto.Response.from(cart);
    }

    @Transactional
    public CartDto.Response addItem(User user, CartDto.AddItemRequest request) {
        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
        if (!food.isAvailable()) {
            throw new BadRequestException("Food is not available");
        }
        Cart cart = getOrCreateCart(user);
        cart.getItems().stream()
                .filter(i -> i.getFood().getId().equals(food.getId()))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + request.getQuantity()),
                        () -> cart.getItems().add(
                                CartItem.builder().cart(cart).food(food).quantity(request.getQuantity()).build())
                );
        return CartDto.Response.from(cartRepository.save(cart));
    }

    @Transactional
    public CartDto.Response updateItem(User user, Long itemId, CartDto.UpdateItemRequest request) {
        Cart cart = getOrCreateCart(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(request.getQuantity());
        }
        return CartDto.Response.from(cartRepository.save(cart));
    }

    @Transactional
    public CartDto.Response removeItem(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return CartDto.Response.from(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }
}
