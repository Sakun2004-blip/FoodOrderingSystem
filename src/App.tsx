import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminFoodsPage from "./pages/admin/AdminFoodsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected User Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute adminOnly />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminOverviewPage />} />
                      <Route path="foods" element={<AdminFoodsPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="users" element={<AdminUsersPage />} />
                    </Route>
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Footer */}
              <footer className="bg-gray-800 text-gray-400 text-sm py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <p>?? FoodOrder &copy; {new Date().getFullYear()} — All rights reserved</p>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
