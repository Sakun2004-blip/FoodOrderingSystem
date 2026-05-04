import React from 'react';
import { OrderStatus } from '../../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:          { label: 'Pending',           className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED:        { label: 'Confirmed',          className: 'bg-blue-100 text-blue-800' },
  PREPARING:        { label: 'Preparing',          className: 'bg-orange-100 text-orange-800' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',   className: 'bg-purple-100 text-purple-800' },
  DELIVERED:        { label: 'Delivered',          className: 'bg-green-100 text-green-800' },
  CANCELLED:        { label: 'Cancelled',          className: 'bg-red-100 text-red-800' },
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`badge ${config.className} px-3 py-1`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
