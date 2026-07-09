"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import Header from "@/components/layout/Header";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

function AuthContent() {
  const { user, login, logout, loading, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setIsSubmitting(true);

    try {
      if (isRegister) {
        // For demonstration / custom php backend registration fallback
        if (!email || !password || !firstName) {
          setLocalError("Please fill in all required fields.");
          setIsSubmitting(false);
          return;
        }
        await login(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setLocalError("Authentication failed. Please check your credentials.");
    }
    setIsSubmitting(false);
  };

  if (user) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justify: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(56,142,60,0.2)" }}>
          <UserCheck size={44} color="#388E3C" />
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#111", marginBottom: "12px" }}>
          Welcome Back, {user.first_name || user.email.split("@")[0]} ✨
        </h1>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6, marginBottom: "32px" }}>
          You are currently signed into your VIP Prestige account ({user.email}). Access your private wishlist and exclusive member discounts.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/category/all"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "linear-gradient(135deg, #111111 0%, #2D1F2F 100%)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "50px",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
          >
            <span>Go to Shop</span>
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => logout()}
            style={{
              padding: "14px 28px",
              borderRadius: "50px",
              background: "#FFF0F5",
              color: "#E8437F",
              border: "1px solid #E8437F",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "48px 20px 80px", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: "24px", padding: "40px 32px", border: "1px solid #EAECEF", boxShadow: "0 12px 40px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
        {/* Top badge */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FFF0F5", padding: "6px 14px", borderRadius: "50px", border: "1px solid #FCD5E5", marginBottom: "16px" }}>
            <Sparkles size={14} color="#E8437F" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#E8437F", letterSpacing: "1px", textTransform: "uppercase" }}>
              VIP Beauty Club Portal
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#111" }}>
            {isRegister ? "Create VIP Account" : "Sign In to GLAMOUR"}
          </h1>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "6px" }}>
            {isRegister ? "Join to unlock 15% off your first luxury ritual" : "Enter your credentials to access your prestige account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {isRegister && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#444", marginBottom: "6px" }}>
                Full Name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="e.g. Victoria Sterling"
                required={isRegister}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1.5px solid #EAECEF", fontSize: "14px", outline: "none", transition: "border-color 150ms" }}
                onFocus={(e) => (e.target.style.borderColor = "#E8437F")}
                onBlur={(e) => (e.target.style.borderColor = "#EAECEF")}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#444", marginBottom: "6px" }}>
              Email Address
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Mail size={18} color="#888" style={{ position: "absolute", left: "16px" }} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="client@glamourbeauty.com"
                required
                style={{ width: "100%", padding: "12px 16px 12px 44px", borderRadius: "12px", border: "1.5px solid #EAECEF", fontSize: "14px", outline: "none", transition: "border-color 150ms" }}
                onFocus={(e) => (e.target.style.borderColor = "#E8437F")}
                onBlur={(e) => (e.target.style.borderColor = "#EAECEF")}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#444" }}>
                Password
              </label>
              {!isRegister && (
                <a href="#" style={{ fontSize: "12px", color: "#E8437F", textDecoration: "none", fontWeight: 600 }}>
                  Forgot?
                </a>
              )}
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock size={18} color="#888" style={{ position: "absolute", left: "16px" }} />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••••••"
                required
                style={{ width: "100%", padding: "12px 16px 12px 44px", borderRadius: "12px", border: "1.5px solid #EAECEF", fontSize: "14px", outline: "none", transition: "border-color 150ms" }}
                onFocus={(e) => (e.target.style.borderColor = "#E8437F")}
                onBlur={(e) => (e.target.style.borderColor = "#EAECEF")}
              />
            </div>
          </div>

          {(localError || error) && (
            <div style={{ padding: "12px", background: "#FFEBEE", borderRadius: "10px", border: "1px solid #FFCDD2", color: "#C62828", fontSize: "13px", fontWeight: 500 }}>
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #111111 0%, #2D1F2F 100%)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              border: "none",
              cursor: isSubmitting || loading ? "wait" : "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 150ms ease",
            }}
            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span>{isSubmitting || loading ? "Authenticating..." : isRegister ? "Create VIP Account" : "Sign In"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #F0F0F0" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            {isRegister ? "Already have a prestige account?" : "New to GLAMOUR Beauty?"}{" "}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setLocalError(""); }}
              style={{ background: "transparent", border: "none", color: "#E8437F", fontWeight: 700, cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
            >
              {isRegister ? "Sign In Here" : "Create Account"}
            </button>
          </p>
        </div>

        {/* Security badge */}
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", justify: "center", gap: "6px", fontSize: "12px", color: "#888" }}>
          <ShieldCheck size={16} color="#388E3C" />
          <span>Encrypted Prestige Authentication</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <CartProvider>
        <CategoriesProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F1F2F4" }}>
            <Header />
            <CategoryNav />
            <main style={{ flex: 1 }}>
              <AuthContent />
            </main>
            <Footer />
          </div>
        </CategoriesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
