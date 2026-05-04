import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItemCard from '../components/cart/CartItemCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as orderApi from '../api/orderApi';
import { PlaceOrderRequest } from '../types';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { cart, isLoading, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [addressError, setAddressError] = useState('');

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setAddressError('Delivery address is required');
      return;
    }
    setAddressError('');
    setIsPlacing(true);
    try {
      const payload: PlaceOrderRequest = {
        deliveryAddress: deliveryAddress.trim(),
        notes: notes || undefined,
        paymentMethod: 'CASH_ON_DELIVERY',
      };
      const res = await orderApi.placeOrder(payload);
      await clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/orders/${res.data.id}`);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

      {isEmpty ? (
        <div className="text-center py-20">
          <span className="text-7xl">🛒</span>
          <p className="text-xl text-gray-500 mt-4">Your cart is empty</p>
          <button onClick={() => navigate('/menu')} className="btn-primary mt-6 px-8">Browse Menu</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {cart.items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span>{item.food.name} × {item.quantity}</span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary-600">${cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-3">
              <h2 className="text-lg font-bold text-gray-800">Delivery Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => { setDeliveryAddress(e.target.value); setAddressError(''); }}
                  className={`input-field resize-none ${addressError ? 'border-red-500' : ''}`}
                  rows={3}
                  placeholder="Enter your delivery address"
                />
                {addressError && <p className="text-xs text-red-600 mt-1">{addressError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Any special instructions?"
                />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="btn-primary w-full py-3 text-base"
              >
                {isPlacing ? 'Placing Order...' : `Place Order · $${cart.totalAmount.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
