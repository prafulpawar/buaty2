"use client";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";

export default function ProductPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1, background: "var(--color-surface)" }}>
              <ProductDetail />
            </main>
            <Footer />
          </div>
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
