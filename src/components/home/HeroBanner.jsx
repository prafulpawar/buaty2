"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

// Your exact Unsplash images from your original code
const banners = [
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
  "https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);

  // Auto-play the slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setActive((p) => (p === 0 ? banners.length - 1 : p - 1));
  const nextSlide = () => setActive((p) => (p === banners.length - 1 ? 0 : p + 1));

  return (
    /* REMOVED: padding: "10px" to allow edge-to-edge */
    <section style={{ width: "100%", padding: "0", boxSizing: "border-box" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          /* REMOVED: maxWidth: "1440px", margin, and borderRadius for full-width bleed */
          overflow: "hidden",
        }}
      >
        {/* Sliding Image Track */}
        <div
          style={{
            display: "flex",
            width: "100%",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${active * 100}%)`,
          }}
        >
          {banners.map((imgSrc, i) => (
            <Link
              key={i}
              href="/category/all"
              style={{
                flexShrink: 0,
                width: "100%",
                display: "block",
                cursor: "pointer"
              }}
            >
              {/* Pure Image ONLY */}
              <img
                src={imgSrc}
                alt={`Banner ${i + 1}`}
                style={{
                  width: "100%",
                  height: "clamp(250px, 35vw, 450px)", /* Forces the images into a wide banner shape */
                  display: "block",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Link>
          ))}
        </div>

        {/* EXACT UI: Bright Blue Circular Arrows */}
        <button className="blue-arrow left-arrow" onClick={prevSlide} aria-label="Previous">
          <ArrowLeft size={20} color="#ffffff" strokeWidth={2.5} />
        </button>
        <button className="blue-arrow right-arrow" onClick={nextSlide} aria-label="Next">
          <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        /* Exact Blue Arrow Styling from Screenshot */
        .blue-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #007bff; /* The exact bright blue */
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .blue-arrow:hover {
          background-color: #0056b3;
          transform: translateY(-50%) scale(1.05);
        }

        /* Adjusted slightly closer to the edge since it's full width now */
        .left-arrow { left: 24px; }
        .right-arrow { right: 24px; }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .blue-arrow {
            width: 30px;
            height: 30px;
          }
          .blue-arrow svg {
            width: 16px;
            height: 16px;
          }
          .left-arrow { left: 12px; }
          .right-arrow { right: 12px; }
        }
      `}</style>
    </section>
  );
}