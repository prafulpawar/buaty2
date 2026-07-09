"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductNav() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products instead of Categories
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/wc/products?per_page=15&status=publish");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <nav className="chakra-nav-container">
        <ul className="chakra-nav-list">
          {[...Array(8)].map((_, i) => (
            <li key={i}>
              <div className="skeleton-text" />
            </li>
          ))}
        </ul>
        <style>{`
          .chakra-nav-container {
            display: flex; justify-content: center; align-items: center;
            width: 100%; background-color: #ffffff;
            border-top: 1px solid #eaeaea; /* ADDED TOP BORDER */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin: 0 auto 1rem;
            padding: 15px 0;
          }
          .chakra-nav-list {
            display: flex; justify-content: flex-start; gap: 40px; width: 80%; max-width: 1400px;
            margin: 0 auto; padding: 0; list-style-type: none; overflow: hidden;
          }
          .skeleton-text {
            width: 100px; height: 16px; border-radius: 4px;
            background: linear-gradient(90deg, #F8F9FA 25%, #EAECEF 50%, #F8F9FA 75%);
            background-size: 400% 100%; animation: lightShimmerAnim 1.5s infinite linear;
          }
          @keyframes lightShimmerAnim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          @media (max-width: 1024px) { .chakra-nav-container { display: none; } }
        `}</style>
      </nav>
    );
  }

  return (
    <nav className="chakra-nav-container">
      <ul className="chakra-nav-list">
        {products.map((prod) => (
          <li key={prod.id} className="chakra-nav-item">
            <Link
              href={`/product/${prod.slug || prod.id}`}
              className="chakra-nav-link"
              dangerouslySetInnerHTML={{ __html: prod.name }}
            />
          </li>
        ))}
      </ul>

      <style>{`
        /* Main Container */
        .chakra-nav-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          background-color: #ffffff;
          border-top: 1px solid #eaeaea; /* ADDED TOP BORDER */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin: 0 auto 1.5rem;
          padding: 15px 0;
          position: relative;
          z-index: 99;
        }

        /* 
          Unordered List - updated for one-by-one single horizontal line
        */
        .chakra-nav-list {
          display: flex;
          justify-content: flex-start; /* Start alignment to flow naturally */
          align-items: center;
          gap: 40px; /* Distinct gap between each product */
          width: 80%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
          list-style-type: none;
          
          /* Force items into exactly one horizontal line and allow scrolling if they exceed width */
          flex-wrap: nowrap;
          overflow-x: auto;
          white-space: nowrap;
          
          /* Hide scrollbar for a clean, seamless look */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        
        .chakra-nav-list::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .chakra-nav-item {
          margin: 0;
          padding: 0;
          flex-shrink: 0; /* Ensures items do not shrink when space runs out */
        }

        /* Link Styling */
        .chakra-nav-link {
          text-decoration: none;
          color: #333333;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s ease-in-out;
        }

        /* Pink hover effect */
        .chakra-nav-link:hover {
          color: #D5418E;
        }

        /* Hidden on mobile */
        @media (max-width: 1024px) {
          .chakra-nav-container {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}