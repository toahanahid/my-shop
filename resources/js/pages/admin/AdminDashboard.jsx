import React, { useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

function AdminDashboard() {

    useEffect(() => {
        document.title = "Admin Dashboard | My Shop";
    }, []);

    return (
            <div className="container-fluid py-4">
                <h1 className="mb-4">Admin Dashboard</h1>

                <div className="row">
                    {/* Example cards */}
                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-primary h-100">
                            <div className="card-body">
                                <h5 className="card-title">Total Products</h5>
                                <p className="card-text">120</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-success h-100">
                            <div className="card-body">
                                <h5 className="card-title">Total Orders</h5>
                                <p className="card-text">45</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-warning h-100">
                            <div className="card-body">
                                <h5 className="card-title">Total Users</h5>
                                <p className="card-text">34</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-danger h-100">
                            <div className="card-body">
                                <h5 className="card-title">Pending Orders</h5>
                                <p className="card-text">10</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You can add charts, tables, etc. below */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                Recent Orders
                            </div>
                            <div className="card-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Order ID</th>
                                            <th>User</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>ORD-001</td>
                                            <td>John Doe</td>
                                            <td>$120</td>
                                            <td>Pending</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>ORD-002</td>
                                            <td>Jane Smith</td>
                                            <td>$75</td>
                                            <td>Completed</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    );
}

export default AdminDashboard;
