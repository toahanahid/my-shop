import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext); // ✅ get user from context
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // ✅ Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/"); // redirect to home if logged in
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(email, password); // call context login

        if (result.success) {
            alert("Login successful!");
            navigate("/"); // redirect to home after login
        } else {
            setError(result.errors.message || "Invalid credentials");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5" style={{ maxWidth: "450px" }}>
                <h3 className="mb-4">Login</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Login;
