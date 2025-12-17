import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Profile | MyShop";
        if (!user) {
            axios.get("/user")
                .then(res => setUser(res.data))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
        <Navbar />
        <div className="container py-4">
            <h2>My Profile</h2>
            <hr />

            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone ?? "N/A"}</p>

            <Link to="/profile/edit" className="btn btn-primary me-2">Edit Profile</Link>
            <Link to="/profile/update-password" className="btn btn-warning">Change Password</Link>
        </div>
        <Footer />
        </div>
    );
}
