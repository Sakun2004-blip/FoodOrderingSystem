import axiosInstance from './axiosInstance';
import { Order, PlaceOrderRequest, OrderStatus, PageResponse } from '../types';

export const placeOrder = (data: PlaceOrderRequest) =>
  axiosInstance.post<Order>('/orders', data);

export const getMyOrders = () =>
  axiosInstance.get<PageResponse<Order>>('/orders/my');

export const getOrderById = (id: number) =>
  axiosInstance.get<Order>(`/orders/${id}`);

export const getAllOrders = () =>
  axiosInstance.get<PageResponse<Order>>('/orders/admin');

export const updateOrderStatus = (id: number, status: OrderStatus) =>
  axiosInstance.patch<Order>(`/orders/admin/${id}/status`, { status });

export const cancelOrder = (id: number) =>
  axiosInstance.post<Order>(`/orders/${id}/cancel`);
