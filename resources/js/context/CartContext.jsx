import { createContext, useState, useEffect } from "react";
import axiosClient from "./axiosClient";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosClient.get("/api/frontend/cart");
      setCart(res.data.cart || { items: [], subtotal: 0 });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart({ items: [], subtotal: 0 });
    }
  };

  const clearCart = () => setCart({ items: [], subtotal: 0 });

  const addToCart = async (productId, qty = 1) => {
    try {
      await axiosClient.post("/api/frontend/cart", { product_id: productId, qty });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartItem = async (itemId, qty) => {
    try {
      await axiosClient.put(`/api/frontend/cart/${itemId}`, { qty });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await axiosClient.delete(`/api/frontend/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, clearCart, addToCart, updateCartItem, removeCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};
