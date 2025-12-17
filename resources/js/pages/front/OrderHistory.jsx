import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = "Order History | MyShop";
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                setError('You must be logged in to view your order history.');
                return;
            }
            try {
                const response = await axiosClient.get('/api/frontend/orders');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">Loading...</main>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">{error}</main>
            <Footer />
        </div>
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">
                <h1 className="mb-4">Order History</h1>
                {orders.length === 0 ? (
                    <p>You have no orders.</p>
                ) : (
                    <div className="list-group">
                        {orders.map(order => (
                            <Link key={order.id} to={`/order/${order.id}`} className="list-group-item list-group-item-action flex-column align-items-start">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Order #{order.id}</h5>
                                    <small>{new Date(order.created_at).toLocaleDateString()}</small>
                                </div>
                                <p className="mb-1">Total: ${parseFloat(order.total).toFixed(2)}</p>
                                <small>Status: {order.status}</small>
                                <div className="mt-2">
                                    <button className="btn btn-sm btn-primary">View Details</button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrderHistory;
