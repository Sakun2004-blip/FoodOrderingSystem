import axiosInstance from './axiosInstance';
import { AddToCartRequest, Cart, UpdateCartItemRequest } from '../types';

export const getCart = () =>
  axiosInstance.get<Cart>('/cart');

export const addToCart = (data: AddToCartRequest) =>
  axiosInstance.post<Cart>('/cart/items', data);

export const updateCartItem = (itemId: number, data: UpdateCartItemRequest) =>
  axiosInstance.put<Cart>(`/cart/items/${itemId}`, data);

export const removeCartItem = (itemId: number) =>
  axiosInstance.delete<Cart>(`/cart/items/${itemId}`);

export const clearCart = () =>
  axiosInstance.delete('/cart');
