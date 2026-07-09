"use client";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import TrendingProducts from "@/components/home/TrendingProducts";
import FeatureStrip from "@/components/home/FeatureStrip";

export default function HomePage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <div >
            <Header />
            <CategoryNav />
            <main >
              <HeroBanner />
              <FeatureStrip />
              <TrendingProducts />
            </main>
            <Footer />
          </div>
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
