import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CartContext } from "../../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../../components/StripePaymentForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalPaymentButtons from "../../components/PayPalPaymentButtons";
import axiosClient from "../../context/axiosClient"; // <- Axios instance with guest ID

// Stripe setup
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLIC_KEY");

// PayPal setup
const initialPayPalOptions = {
  clientId: "YOUR_PAYPAL_CLIENT_ID",
  currency: "USD",
  intent: "capture",
  components: "buttons",
};

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", zip: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();

  // Fetch cart on mount
  useEffect(() => {
    document.title = "Checkout | MyShop";
    fetchCart().finally(() => setLoading(false));
  }, []);

  // Handle order placement
  const handlePlaceOrder = async (e, stripePaymentMethodId = null, paypalOrderId = null) => {
    e?.preventDefault();
    try {
      // CSRF cookie for Laravel Sanctum
      await axiosClient.get("/sanctum/csrf-cookie");

      // Prepare order payload
      const orderData = {
        address,
        payment_method: paymentMethod,
      };

      if (paymentMethod === "stripe" && stripePaymentMethodId) {
        orderData.stripe_payment_method_id = stripePaymentMethodId;
      }

      if (paymentMethod === "paypal" && paypalOrderId) {
        orderData.paypal_order_id = paypalOrderId;
      }

      // Send order request
      const res = await axiosClient.post("/api/frontend/orders", orderData);

      clearCart();
      alert("Order placed successfully! Order ID: " + res.data.order_id);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        // Validation errors
        const errorMessages = Object.values(err.response.data.errors).flat().join("\n");
        alert("Validation Error:\n" + errorMessages);
      } else {
        alert(err.response?.data?.error || err.response?.data?.message || "Error placing order");
      }
    }
  };

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h2>Checkout</h2>

        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.qty}</td>
                    <td>${item.product.price}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Subtotal: ${cart.subtotal}</h4>

            <form onSubmit={paymentMethod === "cod" ? handlePlaceOrder : (e) => e.preventDefault()}>
              <h5>Shipping Address</h5>
              <input
                type="text"
                placeholder="Full Name"
                className="form-control mb-2"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="form-control mb-2"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Street"
                className="form-control mb-2"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="City"
                className="form-control mb-2"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="ZIP"
                className="form-control mb-3"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                required
              />

              <h5 className="mt-3">Payment Method</h5>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <label className="form-check-label">Cash on Delivery (COD)</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  <label className="form-check-label">Credit/Debit Card (Stripe)</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <label className="form-check-label">PayPal</label>
                </div>
              </div>

              {paymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm handlePlaceOrder={handlePlaceOrder} address={address} />
                </Elements>
              )}

              {paymentMethod === "paypal" && (
                <PayPalScriptProvider options={initialPayPalOptions}>
                  <PayPalPaymentButtons handlePlaceOrder={handlePlaceOrder} amount={cart.subtotal} />
                </PayPalScriptProvider>
              )}

              {paymentMethod === "cod" && (
                <button type="submit" className="btn btn-success mt-3">
                  Place Order (COD)
                </button>
              )}
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
