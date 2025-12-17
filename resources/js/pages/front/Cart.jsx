import React, { useEffect, useContext, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const Cart = () => {
  const { cart, fetchCart, updateCartItem, removeCartItem } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Cart | MyShop";
    
    const fetch = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };

    fetch();
  }, []);

  const handleQtyChange = (itemId, qty) => {
    updateCartItem(itemId, qty);
  };

  const handleRemove = (itemId) => {
    removeCartItem(itemId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container my-4">
        <h2>Your Cart</h2>
        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      min="1"
                      className="form-control"
                      style={{ width: "80px" }}
                      onChange={(e) =>
                        handleQtyChange(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>${item.product.price}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h4>Subtotal: ${cart.subtotal}</h4>
        {cart.items.length > 0 && (
          <div className="d-flex justify-content-between gap-2 mt-4">
            <Link to="/products" className="btn btn-secondary btn-lg">
              Continue Shopping
            </Link>
            <Link to="/checkout" className="btn btn-primary btn-lg">
              Checkout
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
