"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/products/ProductCard";
import { Flame } from "lucide-react";

export default function DealsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 32, s: 14 });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/wc/products?per_page=6&status=publish&on_sale=true");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  if (!loading && products.length === 0) return null;

  return (
    <section style={{ padding: "48px 0", background: "linear-gradient(135deg, #1A1A1A 0%, #2D1F2F 100%)" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Flame size={28} color="var(--color-accent)" fill="var(--color-accent)" />
            <div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, color: "#fff" }}>
                Flash Deals
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Grab them before they&apos;re gone</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((val, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ background: "var(--color-accent)", color: "#fff", borderRadius: "var(--radius-sm)", padding: "8px 14px", fontSize: "20px", fontWeight: 700, fontFamily: "monospace", minWidth: "48px", textAlign: "center" }}>
                  {val}
                </div>
                {i < 2 && <span style={{ color: "var(--color-accent)", fontSize: "20px", fontWeight: 700 }}>:</span>}
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", gap: "20px", overflowX: "auto" }} className="no-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ minWidth: "240px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <div className="skeleton" style={{ aspectRatio: "3/4" }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "8px" }} className="no-scrollbar">
            {products.map((p) => (
              <div key={p.id} style={{ minWidth: "240px", maxWidth: "240px", flexShrink: 0 }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
