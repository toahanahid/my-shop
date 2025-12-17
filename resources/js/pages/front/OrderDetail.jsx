import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../context/axiosClient';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = "Order Detail | MyShop";
        const fetchOrderDetail = async () => {
            if (!user) {
                setError('You must be logged in to view order details.');
                setLoading(false);
                return;
            }
            try {
                const response = await axiosClient.get(`/api/frontend/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError('You are not authorized to view this order.');
                } else {
                    setError('Failed to fetch order details.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId, user]);

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

    if (!order) return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-4">Order not found.</main>
            <Footer />
        </div>
    );

    const { shipping_address: address } = order;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 container mt-5">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2>Order Detail</h2>
                        <Link to="/order-history" className="btn btn-secondary">Back to Orders</Link>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h5>Order #{order.id}</h5>
                                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> <span className="text-capitalize">{order.status}</span></p>
                                <p><strong>Payment Method:</strong> <span className="text-uppercase">{order.payment_method}</span></p>
                            </div>
                            <div className="col-md-6">
                                <h5>Shipping Address</h5>
                                <address>
                                    <strong>{address.name}</strong><br />
                                    {address.street}<br />
                                    {address.city}, {address.zip}<br />
                                    <abbr title="Phone">P:</abbr> {address.phone}
                                </address>
                            </div>
                        </div>

                        <h5>Order Items</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.product ? item.product.name : 'Product not found'}</td>
                                        <td>{item.qty}</td>
                                        <td>${parseFloat(item.price).toFixed(2)}</td>
                                        <td>${(item.qty * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="row text-end">
                            <div className="col-md-9"><strong>Subtotal:</strong></div>
                            <div className="col-md-3">${parseFloat(order.subtotal).toFixed(2)}</div>
                            <div className="col-md-9"><strong>Shipping:</strong></div>
                            <div className="col-md-3">${parseFloat(order.shipping).toFixed(2)}</div>
                            <div className="col-md-9"><strong>Discount:</strong></div>
                            <div className="col-md-3">-${parseFloat(order.discount).toFixed(2)}</div>
                            <div className="col-md-9"><h5>Total:</h5></div>
                            <div className="col-md-3"><h5>${parseFloat(order.total).toFixed(2)}</h5></div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetail;
