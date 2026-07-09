"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("glamour_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const register = async (email, password, firstName = "", lastName = "") => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Registration failed");
      if (data?.id) {
        const userData = { id: data.id, email: data.email, first_name: data.first_name, last_name: data.last_name, woocommerce_customer_id: data.woocommerce_customer_id };
        setUser(userData);
        localStorage.setItem("glamour_user", JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: "Unexpected response" };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Login failed");
      if (data?.id && data?.email) {
        let userData = { id: data.id, email: data.email, first_name: data.first_name || "", last_name: data.last_name || "", display_name: data.display_name || "", woocommerce_customer_id: data.woocommerce_customer_id, role: data.role || "customer" };
        // Fetch WooCommerce customer data
        if (data.woocommerce_customer_id) {
          try {
            const wcRes = await fetch(`/api/wc/customers/${data.woocommerce_customer_id}?_=${Date.now()}`);
            const wcData = await wcRes.json();
            userData = { ...userData, billing: wcData.billing || {}, shipping: wcData.shipping || {} };
          } catch {}
        }
        setUser(userData);
        localStorage.setItem("glamour_user", JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, message: "Invalid response from server" };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const logout = () => { setUser(null); localStorage.removeItem("glamour_user"); };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
