// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
  address?: string;
}

// ─── Category ────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

// ─── Food ─────────────────────────────────────────────────────────────────────
export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  category: Category;
}

export interface FoodRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  categoryId: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  food: Food;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  foodId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  food: Food;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderRequest {
  deliveryAddress: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export type PaymentMethod = 'CARD' | 'CASH_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: number;
  order: Order;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
}

export interface PaymentRequest {
  orderId: number;
  method: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
