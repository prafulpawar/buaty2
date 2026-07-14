"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CategoriesProvider, useCategories } from "@/context/CategoriesContext";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { ChevronRight, ShoppingBag, ArrowLeft, Sparkles, Loader2 } from "lucide-react";

// Number of products to fetch per page
const PRODUCTS_PER_PAGE = 16; 

function CategoryContent() {
  const params = useParams();
  const { categories, loading: catLoading } = useCategories();
  
  // Data & Pagination States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const categoryId = params.id;
  const currentCategory = categories.find((c) => String(c.id) === String(categoryId)) || {
    name: categoryId === "all" ? "The Complete Collection" : "Luxury Edit",
  };

  // 1. Initial Load Effect
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
    loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // 2. Fetch Function (Handles both Initial Load & Load More)
  async function loadProducts(pageNum, isInitial = false) {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const url =
        categoryId === "all"
          ? `/api/wc/products?per_page=${PRODUCTS_PER_PAGE}&page=${pageNum}&status=publish`
          : `/api/wc/products?category=${categoryId}&per_page=${PRODUCTS_PER_PAGE}&page=${pageNum}&status=publish`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      // Verify that WooCommerce actually returned an array of products
      if (res.ok && Array.isArray(data)) {
        
        // FIX: Force only ONE image per product to prevent UI clutter
        const formattedData = data.map(product => ({
          ...product,
          images: product.images && product.images.length > 0 ? [product.images[0]] : []
        }));

        if (isInitial) {
          setProducts(formattedData);
        } else {
          setProducts((prev) => [...prev, ...formattedData]);
        }

        // If we received fewer products than requested, there are no more pages
        if (data.length < PRODUCTS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        // Handle Error from WooCommerce gracefully
        console.error("WooCommerce returned invalid data:", data);
        if (isInitial) setProducts([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load category products:", err);
      if (isInitial) setProducts([]);
      setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  // 3. Load More Trigger
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadProducts(nextPage, false);
  };

  return (
    <div style={{ width: "100%", padding: "0 clamp(16px, 4vw, 64px) 80px", background: "#FAFAFA", minHeight: "80vh" }}>
      
      {/* Minimalist Breadcrumb */}
      <div style={{ padding: "24px 0", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#888888", fontWeight: 500 }}>
        <Link href="/" className="breadcrumb-link">
          Home
        </Link>
        <ChevronRight size={14} color="#CCCCCC" />
        <span style={{ color: "#111111", fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: currentCategory.name }} />
      </div>

      <div style={{ background: "#ffffff", borderRadius: "32px", boxShadow: "0 10px 40px rgba(0,0,0,0.02)", border: "1px solid #EAECEF", overflow: "hidden", minHeight: "500px" }}>
        
        {/* Editorial Category Banner */}
        <div 
          style={{ 
            background: "linear-gradient(180deg, #FFF0F5 0%, #ffffff 100%)", 
            padding: "clamp(48px, 6vw, 80px) 24px", 
            textAlign: "center",
            borderBottom: "1px solid #F4F5F7"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Sparkles size={16} color="#E8437F" />
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#E8437F" }}>
              Curated Selection
            </span>
          </div>
          <h1 
            style={{ 
              fontFamily: "var(--font-heading)", 
              fontSize: "clamp(32px, 5vw, 56px)", 
              fontWeight: 800, 
              color: "#111111", 
              letterSpacing: "-0.02em",
              marginBottom: "16px"
            }} 
            dangerouslySetInnerHTML={{ __html: currentCategory.name }} 
          />
          {!loading && (
            <p style={{ fontSize: "15px", color: "#666666" }}>
              Discovering {products.length} exquisite {products.length === 1 ? "formula" : "formulas"} in this collection.
            </p>
          )}
        </div>

        {/* Content Area */}
        <div style={{ padding: "clamp(24px, 5vw, 48px)" }}>
          {loading ? (
            /* Premium Luxury Skeleton Grid (Initial Load) - Updated for better Mobile Responsiveness */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "32px" }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <div className="luxury-shimmer" style={{ width: "100%", aspectRatio: "3/4", borderRadius: "12px", marginBottom: "20px" }} />
                  <div className="luxury-shimmer" style={{ height: "14px", width: "40%", borderRadius: "4px", marginBottom: "12px" }} />
                  <div className="luxury-shimmer" style={{ height: "18px", width: "85%", borderRadius: "4px", marginBottom: "20px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="luxury-shimmer" style={{ height: "20px", width: "30%", borderRadius: "4px" }} />
                    <div className="luxury-shimmer" style={{ height: "36px", width: "36px", borderRadius: "50%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* High-End Empty State */
            <div style={{ textAlign: "center", padding: "80px 20px", maxWidth: "480px", margin: "0 auto" }}>
              <div 
                style={{ 
                  width: "88px", 
                  height: "88px", 
                  borderRadius: "50%", 
                  background: "#FFF0F5", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 24px",
                  border: "1px solid #FFE4EF"
                }}
              >
                <ShoppingBag size={32} color="#E8437F" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#111111", marginBottom: "12px", letterSpacing: "-0.5px" }}>
                The Vault is Empty
              </h2>
              <p style={{ fontSize: "15px", color: "#666666", lineHeight: 1.6, marginBottom: "36px" }}>
                We are currently replenishing our exclusive stock for this collection. Please check back shortly or explore our other prestigious selections.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Link href="/" className="prestige-btn">
                  <ArrowLeft size={18} className="btn-icon-left" />
                  <span>Return to Boutique</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Product Grid - Updated for better Mobile Responsiveness */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "clamp(24px, 4vw, 40px)" }}>
                {products.map((p, i) => (
                  <div 
                    key={`${p.id}-${i}`} 
                    className="staggered-product"
                    style={{ animationDelay: `${(i % PRODUCTS_PER_PAGE) * 60}ms` }}
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Load More Pagination Section */}
              {hasMore && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "64px", paddingTop: "32px", borderTop: "1px solid #F4F5F7" }}>
                  <button 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={18} className="spinner-icon" />
                        <span>Curating More...</span>
                      </>
                    ) : (
                      <span>Discover More Products</span>
                    )}
                  </button>
                </div>
              )}

              {/* End of Catalog Message */}
              {!hasMore && products.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "64px", paddingTop: "32px", borderTop: "1px solid #F4F5F7" }}>
                  <p style={{ fontSize: "14px", color: "#888888", letterSpacing: "0.5px" }}>
                    You have viewed the entire collection.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cascadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .staggered-product {
          opacity: 0;
          animation: cascadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes luxuryShimmerAnim {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .luxury-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 400% 100%;
          animation: luxuryShimmerAnim 2s infinite ease-in-out;
        }
        .breadcrumb-link {
          color: #888888;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .breadcrumb-link:hover {
          color: #E8437F;
        }
        .prestige-btn, .load-more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #111111;
          color: #ffffff;
          padding: 16px 40px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
          cursor: pointer;
        }
        .prestige-btn:hover, .load-more-btn:hover:not(:disabled) {
          background: #E8437F;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(232, 67, 127, 0.25);
        }
        .load-more-btn:disabled {
          background: #333333;
          cursor: not-allowed;
          opacity: 0.9;
        }
        .prestige-btn .btn-icon-left {
          transition: transform 0.3s ease;
        }
        .prestige-btn:hover .btn-icon-left {
          transform: translateX(-4px);
        }
        .spinner-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FAFAFA" }}>
            <Header />
            <CategoryNav />
            <main style={{ flex: 1 }}>
              <CategoryContent />
            </main>
            <Footer />
          </div>
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  );
}