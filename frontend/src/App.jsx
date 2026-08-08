import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';
import { trackVisitor } from './utils/trackVisitor';

// Route-level code splitting — Home stays eager (initial paint), rest lazy-loaded.
const Home = lazy(() => import('./pages/Home'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminVisitors = lazy(() => import('./pages/admin/AdminVisitors'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Loading fallback shown while a route chunk is fetched.
function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" aria-hidden="true" />
    </div>
  );
}

function App() {
  useEffect(() => {
    trackVisitor('/');
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-center" />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="visitors" element={<AdminVisitors />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

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
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
