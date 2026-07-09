"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/wc/products/categories?per_page=100&hide_empty=true");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getCategoryById = useCallback(
    (id) => categories.find((c) => c.id.toString() === id.toString()),
    [categories]
  );

  return (
    <CategoriesContext.Provider value={{ categories, loading, getCategoryById }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be inside CategoriesProvider");
  return ctx;
}
