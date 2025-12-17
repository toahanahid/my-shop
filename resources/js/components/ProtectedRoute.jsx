import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    // While checking auth, show a loading message (or spinner)
    if (loading) return <p>Checking authentication...</p>;

    // If not logged in, redirect to login
    if (!user) return <Navigate to="/login" />;

    // If logged in, render children
    return children;
}
