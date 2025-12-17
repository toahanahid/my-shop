import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Bootstrap and FontAwesome
import "@fortawesome/fontawesome-free/css/all.min.css";
import '/resources/css/style.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';

// Route Wrappers
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Frontend Pages
import Home from "./pages/front/Home";
import Products from './pages/front/Products';
import Cart from './pages/front/Cart';
import Checkout from './pages/front/Checkout';
import Profile from './pages/front/Profile';
import OrderHistory from './pages/front/OrderHistory';
import OrderDetail from './pages/front/OrderDetail';
import Login from './pages/front/Login';
import Register from './pages/front/Register';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLayout from './components/AdminLayout';
import EditProfile from "./pages/user/EditProfile";
import UpdatePassword from "./pages/user/UpdatePassword";

function App() {
    return (
        <AuthProvider>
            <AdminAuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Frontend routes wrapper */}
                        <Route element={<CartProvider><Outlet /></CartProvider>}>
                            <Route index element={<Home />} /> {/* "/" */}
                            <Route path="products" element={<Products />} />
                            <Route path="cart" element={<Cart />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                             <Route path="profile/edit" element={
                                <ProtectedRoute>
                                    <EditProfile />
                                </ProtectedRoute>
                            } />
                             <Route path="profile/update-password" element={
                                <ProtectedRoute>
                                    <UpdatePassword />
                                </ProtectedRoute>
                            } />
                            <Route path="order-history" element={
                                <ProtectedRoute>
                                    <OrderHistory />
                                </ProtectedRoute>
                            } />
                            <Route path="order/:orderId" element={
                                <ProtectedRoute>
                                    <OrderDetail />
                                </ProtectedRoute>
                            } />
                            <Route path="login" element={
                                <GuestRoute>
                                    <Login />
                                </GuestRoute>
                            } />
                            <Route path="register" element={
                                <GuestRoute>
                                    <Register />
                                </GuestRoute>
                            } />
                        </Route>

                        {/* Admin login (public) */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="users" element={<AdminUsers />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                    </Routes>
                </BrowserRouter>
            </AdminAuthProvider>
        </AuthProvider>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
