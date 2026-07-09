"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("glamour_cart");
    if (saved) setCart(JSON.parse(saved));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("glamour_cart", JSON.stringify(cart));
  }, [cart, mounted]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  const formatPrice = (amount) => `₹${(parseFloat(amount) || 0).toFixed(2)}`;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, formatPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
