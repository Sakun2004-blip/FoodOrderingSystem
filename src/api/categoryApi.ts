import axiosInstance from './axiosInstance';
import { Category, CategoryRequest } from '../types';

export const getAllCategories = () =>
  axiosInstance.get<Category[]>('/categories');

export const getCategoryById = (id: number) =>
  axiosInstance.get<Category>(`/categories/${id}`);

export const createCategory = (data: CategoryRequest) =>
  axiosInstance.post<Category>('/categories', data);

export const updateCategory = (id: number, data: CategoryRequest) =>
  axiosInstance.put<Category>(`/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  axiosInstance.delete(`/categories/${id}`);
