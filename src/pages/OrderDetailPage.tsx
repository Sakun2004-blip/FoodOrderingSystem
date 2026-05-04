import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import * as orderApi from '../api/orderApi';
import * as paymentApi from '../api/paymentApi';
import OrderStatusBadge from '../components/order/OrderStatusBadge';
import PaymentForm from '../components/payment/PaymentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { PaymentRequest } from '../types';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    orderApi.getOrderById(Number(id))
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Order not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handlePayment = async (data: PaymentRequest) => {
    setPaymentLoading(true);
    try {
      await paymentApi.processPayment(data);
      showToast('Payment successful!', 'success');
      setShowPayment(false);
      const res = await orderApi.getOrderById(Number(id));
      setOrder(res.data);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Payment failed', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      await orderApi.cancelOrder(order.id);
      showToast('Order cancelled', 'info');
      navigate('/orders');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error || !order) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-red-500 text-lg">{error || 'Order not found'}</p>
      <button onClick={() => navigate('/orders')} className="btn-primary mt-4">Back to Orders</button>
    </div>
  );

  const createdAt = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/orders')} className="text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-6 text-sm font-medium">
        ← Back to Orders
      </button>

      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-sm text-gray-500 mt-1">{createdAt}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Items</h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.food.imageUrl || `https://placehold.co/50x50/f97316/white?text=F`}
                    alt={item.food.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.food.name}</p>
                    <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">× {item.quantity}</p>
                  <p className="font-semibold text-gray-800">${item.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-base mt-4 pt-3 border-t">
            <span>Total</span>
            <span className="text-primary-600">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Delivery Address</h2>
          <p className="text-gray-600">{order.deliveryAddress}</p>
          {order.notes && (
            <>
              <h2 className="text-sm font-semibold text-gray-700 mt-3 mb-1">Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {order.status === 'PENDING' && (
            <>
              <button onClick={() => setShowPayment(!showPayment)} className="btn-primary">
                {showPayment ? 'Hide Payment' : '💳 Pay Now'}
              </button>
              <button onClick={handleCancel} className="btn-danger">Cancel Order</button>
            </>
          )}
        </div>

        {showPayment && (
          <div className="mt-6 border-t pt-6">
            <PaymentForm
              orderId={order.id}
              amount={order.totalAmount}
              onSubmit={handlePayment}
              isLoading={paymentLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
