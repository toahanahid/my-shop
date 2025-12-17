import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch orders from backend API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/backend/orders");
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <h3>Orders</h3>

            {loading && <p>Loading orders...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Subtotal</th>
                            <th>Shipping</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th>Payment Method</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user?.name || "Guest"}</td>
                                <td>{order.status}</td>
                                <td>${order.subtotal}</td>
                                <td>${order.shipping}</td>
                                <td>${order.discount}</td>
                                <td>${order.total}</td>
                                <td>{order.payment_method || "N/A"}</td>
                                <td>{new Date(order.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminOrders;
