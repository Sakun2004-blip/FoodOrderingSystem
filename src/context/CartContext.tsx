import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartItem } from '../types';
import * as cartApi from '../api/cartApi';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (foodId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (foodId: number, quantity: number) => {
    setError(null);
    try {
      const res = await cartApi.addToCart({ foodId, quantity });
      setCart(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item');
      throw err;
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    setError(null);
    try {
      const res = await cartApi.updateCartItem(itemId, { quantity });
      setCart(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update item');
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    setError(null);
    try {
      const res = await cartApi.removeCartItem(itemId);
      setCart(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item');
      throw err;
    }
  };

  const clearCart = async () => {
    setError(null);
    try {
      await cartApi.clearCart();
      setCart(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    }
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, error, fetchCart, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
