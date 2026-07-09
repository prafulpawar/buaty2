"use client";
import { useState } from "react";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider, useCart } from "@/context/CartContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Lock, Sparkles, CheckCircle } from "lucide-react";

function CartContent() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = cartTotal || 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const discountAmount = discountApplied ? subtotal * 0.2 : 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "GLOW20") {
      setDiscountApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid VIP code. Try GLOW20");
      setDiscountApplied(false);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      clearCart();
    }, 1500);
  };

  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: "64px 20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justify: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(56,142,60,0.2)" }}>
          <CheckCircle size={44} color="#388E3C" />
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 800, color: "#111", marginBottom: "12px" }}>
          Ritual Order Confirmed ✨
        </h1>
        <p style={{ fontSize: "16px", color: "#666", lineHeight: 1.7, marginBottom: "32px" }}>
          Thank you for choosing GLAMOUR. Your prestige beauty ritual is being carefully prepared in our Mayfair flagship boutique. A tracking link has been sent to your email.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "linear-gradient(135deg, #111111 0%, #2D1F2F 100%)",
            color: "#fff",
            padding: "16px 36px",
            borderRadius: "50px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <span>Continue Shopping</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "linear-gradient(135deg, #FFF0F5 0%, #FFF8FA 100%)", display: "flex", alignItems: "center", justify: "center", margin: "0 auto 24px", border: "2px solid #FCD5E5", boxShadow: "0 8px 24px rgba(232,67,127,0.1)" }}>
          <ShoppingBag size={42} color="#E8437F" strokeWidth={1.6} />
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#111", marginBottom: "12px" }}>
          Your Luxury Bag is Empty
        </h1>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6, marginBottom: "32px" }}>
          Looks like you haven&apos;t added any prestige beauty rituals or luxury cosmetics to your bag yet.
        </p>
        <Link
          href="/category/all"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "linear-gradient(135deg, #E8437F 0%, #FF6B9D 100%)",
            color: "#fff",
            padding: "16px 36px",
            borderRadius: "50px",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(232,67,127,0.3)",
            transition: "transform 150ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <span>Explore Prestige Shop</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 0 80px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#111" }}>
          Shopping Bag
        </h1>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#888", background: "#F5F5F7", padding: "4px 12px", borderRadius: "20px" }}>
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", alignItems: "start" }}>
        {/* Left Column: Cart Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {cart.map((item) => {
            const price = parseFloat(item.price) || 0;
            const itemTotal = price * (item.quantity || 1);
            return (
              <div
                key={item.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid #EAECEF",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link href={`/product/${item.id}`} style={{ width: "90px", height: "90px", borderRadius: "12px", background: "#F8F9FA", border: "1px solid #eee", display: "flex", alignItems: "center", justify: "center", padding: "8px", flexShrink: 0 }}>
                  <img src={item.images?.[0]?.src || "/placeholder.jpg"} alt={item.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </Link>

                <div style={{ flex: 1, minWidth: "180px" }}>
                  <Link href={`/product/${item.id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111", lineHeight: 1.4, marginBottom: "6px" }} dangerouslySetInnerHTML={{ __html: item.name }} />
                  </Link>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#E8437F" }}>
                    ₹{price.toFixed(2)} <span style={{ fontSize: "12px", color: "#888", fontWeight: 500 }}>each</span>
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }} className="cart-item-actions">
                  <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #EAECEF", borderRadius: "50px", background: "#FAF9FB", padding: "2px" }}>
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justify: "center", color: "#444", background: "#fff", border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ minWidth: "36px", textAlign: "center", fontSize: "14px", fontWeight: 700, color: "#111" }}>
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justify: "center", color: "#444", background: "#fff", border: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#111" }}>
                      ₹{itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      style={{ padding: "8px", color: "#888", background: "transparent", border: "none", cursor: "pointer", transition: "color 150ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FF4343")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Price Summary Card */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", border: "1px solid #EAECEF", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", position: "sticky", top: "100px" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 800, color: "#111", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #F0F0F0" }}>
            Order Summary
          </h2>

          {/* Promo code */}
          <form onSubmit={handleApplyPromo} style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "8px" }}>
              Promo / VIP Code
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try GLOW20"
                disabled={discountApplied}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #EAECEF", fontSize: "14px", outline: "none", background: discountApplied ? "#F5F5F7" : "#fff" }}
              />
              <button
                type="submit"
                disabled={discountApplied}
                style={{ padding: "10px 18px", borderRadius: "10px", background: discountApplied ? "#388E3C" : "#111", color: "#fff", fontSize: "13px", fontWeight: 700, border: "none", cursor: discountApplied ? "default" : "pointer" }}
              >
                {discountApplied ? "Applied ✓" : "Apply"}
              </button>
            </div>
            {promoError && <p style={{ fontSize: "12px", color: "#FF4343", marginTop: "6px" }}>{promoError}</p>}
            {discountApplied && <p style={{ fontSize: "12px", color: "#388E3C", fontWeight: 600, marginTop: "6px" }}>✨ 20% VIP discount applied!</p>}
          </form>

          {/* Calculations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "20px", borderBottom: "1px solid #F0F0F0", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
              <span>Subtotal ({cart.length} items)</span>
              <span style={{ fontWeight: 600, color: "#111" }}>₹{subtotal.toFixed(2)}</span>
            </div>
            {discountApplied && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#388E3C", fontWeight: 600 }}>
                <span>VIP Discount (20%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
              <span>Estimated Delivery</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? "#388E3C" : "#111" }}>
                {shipping === 0 ? "FREE ✨" : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "20px 0 24px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>Total Amount</span>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#E8437F" }}>₹{total.toFixed(2)}</span>
          </div>

          {/* Checkout button */}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #E8437F 0%, #FF6B9D 100%)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              border: "none",
              cursor: isCheckingOut ? "wait" : "pointer",
              boxShadow: "0 8px 24px rgba(232,67,127,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "transform 150ms ease",
            }}
            onMouseEnter={(e) => { if (!isCheckingOut) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { if (!isCheckingOut) e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <Lock size={18} />
            <span>{isCheckingOut ? "Securing Order..." : "Proceed to Secure Checkout"}</span>
          </button>

          {/* Guarantee badges */}
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", fontSize: "12px", color: "#888", borderTop: "1px dashed #eee", paddingTop: "16px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ShieldCheck size={15} color="#388E3C" /> 256-Bit SSL Encryption</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Sparkles size={15} color="#C9A96E" /> 100% Authentic</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F1F2F4" }}>
            <Header />
            <CategoryNav />
            <main style={{ flex: 1 }}>
              <CartContent />
            </main>
            <Footer />
          </div>
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
