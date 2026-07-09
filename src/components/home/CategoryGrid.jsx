"use client";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesContext";
import { Sparkles, Droplets, Wind, Scissors, Bath, Palette } from "lucide-react";

const iconMap = {
  skincare: Droplets,
  makeup: Palette,
  fragrance: Wind,
  haircare: Scissors,
  bath: Bath,
};

export default function CategoryGrid() {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <section style={{ padding: "32px 0" }}>
        <div className="container">
          <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <div className="skeleton" style={{ width: "200px", height: "24px", marginBottom: "20px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "20px" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div className="skeleton" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
                  <div className="skeleton" style={{ width: "70px", height: "14px" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filter out empty categories or uncategorized
  const validCats = categories.filter(
    (c) => c.parent === 0 && c.slug !== "uncategorized" && (c.count === undefined || c.count > 0)
  ).slice(0, 8);

  if (validCats.length === 0) return null;

  return (
    <section style={{ padding: "16px 0" }}>
      <div className="container">
        <div style={{ background: "#fff", borderRadius: "8px", padding: "24px 24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #f0f0f0", paddingBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", letterSpacing: "-0.3px" }}>
                Explore Beauty Categories
              </h2>
              <p style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>Handpicked collections for your daily glow</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "24px", justifyItems: "center" }}>
            {validCats.map((cat) => {
              const slug = cat.slug?.toLowerCase() || "";
              const IconComp = Object.entries(iconMap).find(([k]) => slug.includes(k))?.[1] || Sparkles;

              return (
                <Link key={cat.id} href={`/category/${cat.id}`}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textDecoration: "none", transition: "transform 150ms ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    const box = e.currentTarget.querySelector(".cat-box");
                    if (box) { box.style.borderColor = "#E8437F"; box.style.boxShadow = "0 6px 16px rgba(232,67,127,0.15)"; }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    const box = e.currentTarget.querySelector(".cat-box");
                    if (box) { box.style.borderColor = "#eee"; box.style.boxShadow = "none"; }
                  }}>
                  <div className="cat-box" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#FAFAFC", border: "1.5px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "all 200ms ease" }}>
                    {cat.image?.src ? (
                      <img src={cat.image.src} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <IconComp size={28} color="#E8437F" strokeWidth={1.6} />
                    )}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#222", textAlign: "center" }}
                    dangerouslySetInnerHTML={{ __html: cat.name }} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
