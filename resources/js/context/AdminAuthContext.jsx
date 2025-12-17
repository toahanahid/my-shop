// resources/js/context/AdminAuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchAdmin();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get("/api/backend/user");
            setAdmin(res.data); // backend returns user object
        } catch (err) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post("/api/backend/login", { email, password });
            const token = res.data.token;
            localStorage.setItem("adminToken", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setAdmin(res.data.user); // adjust if backend returns 'admin'
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/backend/logout");
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.removeItem("adminToken");
            delete axios.defaults.headers.common["Authorization"];
            setAdmin(null);
        }
    };

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
