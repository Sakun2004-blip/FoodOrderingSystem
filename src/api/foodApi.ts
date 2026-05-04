import axiosInstance from './axiosInstance';
import { Food, FoodRequest, PageResponse } from '../types';

export const getAllFoods = (params?: {
  page?: number;
  size?: number;
  categoryId?: number;
  search?: string;
}) => axiosInstance.get<PageResponse<Food>>('/foods', { params });

export const getFoodById = (id: number) =>
  axiosInstance.get<Food>(`/foods/${id}`);

export const createFood = (data: FoodRequest) =>
  axiosInstance.post<Food>('/foods', data);

export const updateFood = (id: number, data: FoodRequest) =>
  axiosInstance.put<Food>(`/foods/${id}`, data);

export const deleteFood = (id: number) =>
  axiosInstance.delete(`/foods/${id}`);

export const toggleFoodAvailability = (id: number) =>
  axiosInstance.patch<Food>(`/foods/${id}/toggle-availability`);
