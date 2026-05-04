import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../../types';
import * as orderApi from '../../api/orderApi';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data.content || []);
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, status);
      showToast('Order status updated', 'success');
      fetchOrders();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Orders ({filteredOrders.length})</h2>
        <div className="flex flex-wrap gap-2">
          {(['ALL', ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Update Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No orders found</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.user.name}</p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length} item(s)</td>
                  <td className="px-4 py-3 font-bold text-primary-600">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="input-field py-1 text-xs"
                      disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
