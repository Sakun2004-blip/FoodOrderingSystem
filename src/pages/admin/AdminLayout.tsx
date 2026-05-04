import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="card p-3 space-y-1">
            <NavLink to="/admin" className={linkClass} end>📊 Overview</NavLink>
            <NavLink to="/admin/foods" className={linkClass}>🍔 Foods</NavLink>
            <NavLink to="/admin/categories" className={linkClass}>📂 Categories</NavLink>
            <NavLink to="/admin/orders" className={linkClass}>📋 Orders</NavLink>
            <NavLink to="/admin/users" className={linkClass}>👥 Users</NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
