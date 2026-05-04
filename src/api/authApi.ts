import axiosInstance from './axiosInstance';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const login = (data: LoginRequest) =>
  axiosInstance.post<AuthResponse>('/auth/login', data);

export const register = (data: RegisterRequest) =>
  axiosInstance.post<AuthResponse>('/auth/register', data);

export const logout = () =>
  axiosInstance.post('/auth/logout');
