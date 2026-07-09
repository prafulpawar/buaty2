"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  // Fallbacks & Parsing
  const img = product?.images?.[0]?.src || "/placeholder.jpg";
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
      // बिल्कुल आपके पहले (Flipkart वाले) कोड की तरह
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
        
        {/* --- 1. IMAGE & BADGES --- */}
        <div className="image-showcase">
          {/* Sale Badge */}
          {onSale && (
            <span className="luxury-sale-badge">
              -{discount}%
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="wishlist-action"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              strokeWidth={wishlisted ? 0 : 1.5}
              fill={wishlisted ? "#E8437F" : "none"}
              color={wishlisted ? "#E8437F" : "#111111"}
              style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </button>

          {/* Product Image wrapped in Link */}
          <Link href={`/product/${product?.id}`} style={{ display: 'block', height: '100%' }}>
            <img
              src={img}
              alt={product?.name || "Product"}
              className="product-img"
            />
          </Link>
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

        /* Image Showcase */
        .image-showcase {
          position: relative;
          aspect-ratio: 4/5;
          background: #F8F9FA;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 16px;
          border: 1px solid rgba(0,0,0,0.02);
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

        /* Badges & Actions */
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

        .wishlist-action {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wishlist-action:hover {
          transform: scale(1.1);
          border-color: #E8437F;
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
          position: relative; /* Added to keep it clickable */
          z-index: 10;        /* Added to keep it clickable */
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