import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Home | MyShop";

        // Simulate API fetch or delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                // Loading full page
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                // Full page content after loading
                <div>
                    <Navbar />

                    {/* Hero Section */}
                    <section className="bg-primary text-white text-center d-flex align-items-center" style={{ minHeight: "70vh" }}>
                        <div className="container">
                            <h1 className="display-3 fw-bold">Welcome to Our Store</h1>
                            <p className="lead mt-3">Discover amazing products and shop with ease.</p>
                            <div className="mt-4">
                                <Link to="/products" className="btn btn-light btn-lg me-3">Shop Now</Link>
                                <Link to="/about" className="btn btn-outline-light btn-lg">Learn More</Link>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-5">
                        <div className="container text-center">
                            <h2 className="mb-4">Why Choose Us?</h2>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card p-4 shadow-sm">
                                        <h4>Quality Products</h4>
                                        <p>We ensure top quality items for your daily needs.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card p-4 shadow-sm">
                                        <h4>Fast Delivery</h4>
                                        <p>Get your orders delivered quickly and safely.</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card p-4 shadow-sm">
                                        <h4>Secure Payments</h4>
                                        <p>Shop confidently with our secure payment system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-dark text-white py-5 text-center">
                        <div className="container">
                            <h2>Join Thousands of Happy Customers</h2>
                            <p className="lead mt-2">Start shopping today and experience the difference.</p>
                            <Link to="/register" className="btn btn-primary btn-lg mt-3">Get Started</Link>
                        </div>
                    </section>

                    <Footer />
                </div>
            )}
        </>
    );
};

export default Home;
