import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function GuestRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    // Show something while checking auth
    if (loading) return <p>Checking authentication...</p>;

    // Redirect if logged in
    return user ? <Navigate to="/" /> : children;
}
