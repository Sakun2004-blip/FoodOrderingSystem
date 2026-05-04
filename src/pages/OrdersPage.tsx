import React, { useState, useEffect, useCallback } from 'react';
import { Order } from '../types';
import * as orderApi from '../api/orderApi';
import OrderCard from '../components/order/OrderCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderApi.getMyOrders();
      setOrders(res.data.content || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async (id: number) => {
    try {
      await orderApi.cancelOrder(id);
      showToast('Order cancelled', 'info');
      fetchOrders();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button onClick={fetchOrders} className="btn-primary mt-4">Retry</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-7xl">📋</span>
          <p className="text-xl text-gray-500 mt-4">No orders yet</p>
          <a href="/menu" className="btn-primary mt-6 inline-block px-8">Start Ordering</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
