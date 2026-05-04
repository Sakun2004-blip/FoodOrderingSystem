import axiosInstance from './axiosInstance';
import { Payment, PaymentRequest } from '../types';

export const processPayment = (data: PaymentRequest) =>
  axiosInstance.post<Payment>('/payments', data);

export const getPaymentByOrder = (orderId: number) =>
  axiosInstance.get<Payment>(`/payments/order/${orderId}`);

export const getMyPayments = () =>
  axiosInstance.get<Payment[]>('/payments/my-payments');
