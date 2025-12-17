import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLayout = () => {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <nav className="bg-dark text-white p-3" style={{ width: "250px" }}>
                <h3 className="mb-4">Admin Panel</h3>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2">
                        <Link className="nav-link text-white" to="/admin/products">
                            Products
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link className="nav-link text-white" to="/admin/categories">
                            Categories
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link className="nav-link text-white" to="/admin/orders">
                            Orders
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link className="nav-link text-white" to="/admin/users">
                            Users
                        </Link>
                    </li>
                    <li className="nav-item mt-4">
                        <button className="btn btn-danger w-100" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="flex-grow-1 p-4 bg-light">
                {/* Top Bar */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Welcome, {admin ? admin.name : "Admin"}</h2>
                </div>

                {/* Page Content */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
