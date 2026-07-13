"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  // Fallbacks & Parsing
  // Get all images for the slider, fallback to placeholder if none exist
  const images = product?.images?.length > 0 ? product.images : [{ src: "/placeholder.jpg" }];
  
  const price = parseFloat(product?.price) || 0;
  const regularPrice = parseFloat(product?.regular_price) || 0;
  const salePrice = parseFloat(product?.sale_price) || 0;
  const onSale = product?.on_sale && salePrice > 0;
  const discount = onSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  const rating = parseFloat(product?.average_rating) || 0;
  const brand = product?.brands?.[0]?.name || product?.categories?.[0]?.name || "";

  // Fixed Add to Cart Handler
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (product) {
      addToCart(product); 
      setAdded(true);
      setTimeout(() => setAdded(false), 2000); 
    }
  };

  return (
    <div
      className="luxury-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-link-wrapper">
        
        {/* --- 1. IMAGE SHOWCASE & MOBILE SLIDER --- */}
        <div className="image-showcase">
          {/* Sale Badge */}
          {onSale && (
            <span className="luxury-sale-badge">
              -{discount}%
            </span>
          )}

          {/* Swipeable Image Slider (Active on Mobile) */}
          <div className="image-slider hide-scroll">
            {images.map((img, idx) => (
              <Link 
                key={idx} 
                href={`/product/${product?.id}`} 
                className="slide-link"
              >
                <img
                  src={img.src}
                  alt={product?.name || `Product image ${idx + 1}`}
                  className="product-img"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </Link>
            ))}
          </div>

          {/* Optional Mobile Indicator Dots (Only shows if > 1 image on mobile) */}
          {images.length > 1 && (
            <div className="slider-dots">
              {images.map((_, i) => (
                <div key={i} className="dot" />
              ))}
            </div>
          )}
        </div>

        {/* --- 2. PRODUCT DETAILS --- */}
        <div className="product-info">
          
          <div className="info-top">
            {/* Brand / Category Tag */}
            {brand && <p className="brand-tag">{brand}</p>}

            {/* Product Title wrapped in Link */}
            <Link href={`/product/${product?.id}`} style={{ textDecoration: 'none' }}>
              <h3 
                className="product-title" 
                dangerouslySetInnerHTML={{ __html: product?.name || "Luxury Item" }} 
              />
            </Link>

            {/* Minimalist Reviews */}
            <div className="review-wrap">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    fill={i < Math.round(rating || 5) ? "#C9A96E" : "none"} 
                    stroke={i < Math.round(rating || 5) ? "#C9A96E" : "#EAECEF"} 
                  />
                ))}
              </div>
              <span className="review-count">({product?.rating_count || 0})</span>
            </div>
          </div>

          <div className="info-bottom">
            {/* Pricing */}
            <div className="price-wrap">
              <span className="current-price">₹{price.toFixed(2)}</span>
              {onSale && (
                <span className="old-price">₹{regularPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Quick Add To Bag Button */}
            <button
              onClick={handleAddToCart}
              className={`quick-add-btn ${added ? "added-success" : ""}`}
            >
              {added ? (
                <><Check size={16} /> Secured</>
              ) : (
                <><ShoppingBag size={16} /> Add to Bag</>
              )}
            </button>
          </div>
          
        </div>
      </div>

      <style jsx>{`
        /* Card Wrapper */
        .luxury-product-card {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .luxury-product-card:hover {
          transform: translateY(-6px);
        }

        .card-link-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* --- Image Showcase & Slider --- */
        .image-showcase {
          position: relative;
          aspect-ratio: 4/5;
          background: #F8F9FA;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 16px;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .image-slider {
          display: flex;
          width: 100%;
          height: 100%;
          /* Desktop default: no scroll, hide extra images */
          overflow: hidden; 
        }

        .slide-link {
          flex: 0 0 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .product-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          mix-blend-mode: multiply; 
        }

        .luxury-product-card:hover .product-img {
          transform: scale(1.08);
        }

        /* Mobile Specifics for Slider */
        @media (max-width: 768px) {
          .image-slider {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch; /* Smooth momentum scrolling on iOS */
          }
          .slide-link {
            scroll-snap-align: center;
          }
        }

        /* Hide Scrollbar for Slider */
        .hide-scroll::-webkit-scrollbar { 
          display: none; 
        }
        .hide-scroll { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }

        /* Slider Dots (Mobile Only) */
        .slider-dots {
          display: none;
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          justify-content: center;
          gap: 4px;
          z-index: 10;
          pointer-events: none;
        }
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
        }
        .dot:first-child {
          background: rgba(0,0,0,0.6); /* Highlights first dot by default */
        }
        @media (max-width: 768px) {
          .slider-dots { display: flex; }
        }

        /* Badges */
        .luxury-sale-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          background: #111111;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 50px;
          letter-spacing: 1px;
        }

        /* Product Info Layout */
        .product-info {
          padding: 0 8px 8px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          gap: 16px;
        }

        .info-top {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .brand-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #C9A96E;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-title {
          font-size: 15px;
          font-weight: 600;
          color: #111111;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }
        .luxury-product-card:hover .product-title {
          color: #E8437F;
        }

        /* Reviews */
        .review-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .stars {
          display: flex;
          gap: 2px;
        }
        .review-count {
          font-size: 12px;
          color: #888888;
          font-weight: 500;
        }

        /* Pricing & Button Area */
        .info-bottom {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .price-wrap {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .current-price {
          font-size: 18px;
          font-weight: 700;
          color: #111111;
          letter-spacing: -0.5px;
        }
        .old-price {
          font-size: 13px;
          color: #999999;
          text-decoration: line-through;
          font-weight: 500;
        }

        /* Sleek Add Button */
        .quick-add-btn {
          position: relative; 
          z-index: 10;        
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #FAFAFA;
          color: #111111;
          border: 1px solid #EAECEF;
          padding: 12px 16px;
          border-radius: 100px; 
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .luxury-product-card:hover .quick-add-btn:not(.added-success) {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .quick-add-btn:hover:not(.added-success) {
          background: #E8437F !important;
          border-color: #E8437F !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(232, 67, 127, 0.25) !important;
        }

        /* Success State */
        .added-success {
          background: #10B981 !important;
          color: #ffffff !important;
          border-color: #10B981 !important;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
}