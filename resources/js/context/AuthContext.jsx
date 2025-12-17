import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set token from localStorage if exists
    useEffect(() => {
        const token = localStorage.getItem("token"); // check if token exists
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser(); // only fetch user if token exists
        } else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    // Fetch current user
    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/user");
            setUser(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                // User not logged in
                setUser(null);
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const guestId = localStorage.getItem('guest_id');
            const headers = {};
            if (guestId) {
                headers['X-Guest-ID'] = guestId;
            }

            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post("/login", { email, password }, { headers });
            
            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            // After successful login and token setup, guestId is no longer needed
            if (guestId) {
                localStorage.removeItem('guest_id');
                delete axios.defaults.headers.common['X-Guest-ID'];
            }

            await fetchUser();
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err);
            return { success: false, errors: err.response?.data || err.message };
        }
    };

    // Register
    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await axios.post("/register", { name, email, password, password_confirmation });
            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            await fetchUser();
            return { success: true };
        } catch (err) {
            console.error(err.response?.data || err);
            return { success: false, errors: err.response?.data || err.message };
        }
    };

    // Logout
    const logout = async () => {
        try {
            await axios.post("/logout"); // API call
            localStorage.removeItem("token"); // remove token
            delete axios.defaults.headers.common['Authorization'];
            setUser(null); // <- THIS triggers Navbar re-render
        } catch (err) {
            console.error(err.response?.data || err);
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
