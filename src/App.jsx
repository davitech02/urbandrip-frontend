// 1. IMPORTS SECTION
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTracking from './pages/OrderTracking';
import DashboardPage from './pages/DashboardPage';
import MyOrdersPage from './pages/MyOrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';

// Admin imports
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminVisitors from './pages/admin/AdminVisitors';
import AdminSettings from './pages/admin/AdminSettings';

// Utilities
import { trackVisitor } from './utils/trackVisitor';


// 2. MAIN APP FUNCTION
function App() {
  useEffect(() => {
    // Track visitor on app load
    trackVisitor('/');
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          />

          {/* Public Routes */}
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;