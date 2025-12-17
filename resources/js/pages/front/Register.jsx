import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ import AuthContext

const Register = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // ✅ get user from context

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // ✅ Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/"); // redirect to home if logged in
        }
    }, [user, navigate]);

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.get("/sanctum/csrf-cookie");

            const res = await axios.post("/register", form);

            setMessage("Registration successful!");
            setErrors({}); // Clear errors

            // Reset form fields
            setForm({
                name: "",
                email: "",
                password: "",
                password_confirmation: ""
            });

            // Optional: store token
            localStorage.setItem("token", res.data.token);

            // Redirect to login page after success
            setTimeout(() => navigate("/login"), 1000);

        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5" style={{ maxWidth: "500px" }}>
                <h2 className="mb-4">Register</h2>

                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleInput}
                        />
                        {errors.name && <small className="text-danger">{errors.name[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleInput}
                        />
                        {errors.email && <small className="text-danger">{errors.email[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleInput}
                        />
                        {errors.password && <small className="text-danger">{errors.password[0]}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleInput}
                        />
                    </div>

                    <button className="btn btn-primary w-100">Register</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
