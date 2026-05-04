import React, { useState, useEffect } from 'react';
import * as foodApi from '../../api/foodApi';
import * as categoryApi from '../../api/categoryApi';
import * as orderApi from '../../api/orderApi';
import * as userApi from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PageResponse, Food, Order } from '../../types';

interface Stats {
  totalFoods: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  revenue: number;
}

const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      foodApi.getAllFoods({ size: 1 }),
      categoryApi.getAllCategories(),
      orderApi.getAllOrders(),
      userApi.getAllUsers(),
    ]).then(([foodsRes, catsRes, ordersRes, usersRes]) => {
      const orders = (ordersRes.data.content || []) as Order[];
      setStats({
        totalFoods: (foodsRes.data as PageResponse<Food>).totalElements,
        totalCategories: catsRes.data.length,
        totalOrders: orders.length,
        totalUsers: usersRes.data.length,
        pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
        revenue: orders.filter((o) => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0),
      });
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const tiles = stats ? [
    { label: 'Total Foods', value: stats.totalFoods, icon: '🍔', color: 'bg-orange-50 border-orange-200' },
    { label: 'Categories', value: stats.totalCategories, icon: '📂', color: 'bg-blue-50 border-blue-200' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📋', color: 'bg-purple-50 border-purple-200' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'bg-yellow-50 border-yellow-200' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-green-50 border-green-200' },
    { label: 'Revenue (Delivered)', value: `$${stats.revenue.toFixed(2)}`, icon: '💰', color: 'bg-emerald-50 border-emerald-200' },
  ] : [];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Overview</h2>
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {tiles.map(({ label, value, icon, color }) => (
            <div key={label} className={`card p-5 border ${color}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOverviewPage;
