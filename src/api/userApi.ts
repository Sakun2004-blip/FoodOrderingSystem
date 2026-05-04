import axiosInstance from './axiosInstance';
import { User, UpdateProfileRequest } from '../types';

export const getProfile = () =>
  axiosInstance.get<User>('/users/me');

export const updateProfile = (data: UpdateProfileRequest) =>
  axiosInstance.put<User>('/users/me', data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  axiosInstance.put('/users/me/password', data);

export const getAllUsers = () =>
  axiosInstance.get<User[]>('/users');

export const deleteUser = (id: number) =>
  axiosInstance.delete(`/users/${id}`);
