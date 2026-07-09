"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const onClick = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) { setOpen(false); setQuery(""); setResults([]); } };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    if (val.trim().length < 2) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wc/products?search=${encodeURIComponent(val.trim())}&per_page=6&status=publish`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ padding: "8px", borderRadius: "50%", transition: "background var(--transition-fast)" }}
        onMouseEnter={(e) => (e.target.style.background = "var(--color-accent-light)")}
        onMouseLeave={(e) => (e.target.style.background = "transparent")}
        aria-label="Search">
        <Search size={20} strokeWidth={1.8} />
      </button>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "min(400px, 90vw)", background: "var(--color-surface)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xl)", zIndex: 200, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--color-border-light)", gap: "10px" }}>
            <Search size={18} color="var(--color-text-muted)" />
            <input ref={inputRef} value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search products..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", background: "transparent" }} />
            {query && <button onClick={() => { setQuery(""); setResults([]); }} aria-label="Clear"><X size={16} color="var(--color-text-muted)" /></button>}
          </div>

          {loading && <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "var(--color-text-muted)" }}>Searching...</div>}

          {!loading && results.length > 0 && (
            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              {results.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", transition: "background var(--transition-fast)", borderBottom: "1px solid var(--color-border-light)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-accent-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <img src={p.images?.[0]?.src || "/placeholder.jpg"} alt={p.name} style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-accent)" }}>₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "var(--color-text-muted)" }}>No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
