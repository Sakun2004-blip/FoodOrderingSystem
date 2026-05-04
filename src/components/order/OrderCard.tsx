import React from 'react';
import { Order } from '../../types';
import OrderStatusBadge from './OrderStatusBadge';
import { useNavigate } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
  onCancel?: (id: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel }) => {
  const navigate = useNavigate();
  const createdAt = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="card p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
          <p className="text-xs text-gray-400">{createdAt}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-3">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600 py-1">
            <span>{item.food.name} × {item.quantity}</span>
            <span>${item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-gray-400 mt-1">+{order.items.length - 3} more items</p>
        )}
      </div>

      <div className="border-t pt-3 flex items-center justify-between">
        <span className="font-bold text-gray-800">Total: ${order.totalAmount.toFixed(2)}</span>
        <div className="flex gap-2">
          {order.status === 'PENDING' && onCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="btn-secondary text-sm py-1.5 px-3"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
