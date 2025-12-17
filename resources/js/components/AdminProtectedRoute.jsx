import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
    const { admin, loading } = useAdminAuth();

    // While checking login status, show nothing or a loader
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    // If not logged in, redirect to admin login page
    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    // If logged in, render child components (AdminLayout and nested routes)
    return children;
};

export default AdminProtectedRoute;
