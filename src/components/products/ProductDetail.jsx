"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Star, Heart, ChevronRight, ChevronUp, ChevronDown, 
  MapPin, ShieldCheck, RotateCcw, CheckCircle2, TicketPercent, Info
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/products/ProductCard";

export default function ProductDetail() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/wc/products/${params.id}`);
        const data = await res.json();
        setProduct(data);
        if (data.categories?.[0]?.id) {
          const relRes = await fetch(`/api/wc/products?category=${data.categories[0].id}&per_page=5&status=publish`);
          const relData = await relRes.json();
          setRelated(Array.isArray(relData) ? relData.filter((p) => p.id !== data.id).slice(0, 4) : []);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      }
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1); // Defaulting to 1 as per new UI design
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // --- LIGHT MODE LOADING SKELETON ---
  if (loading) {
    return (
      <div className="page-container loading-state">
        <div className="skeleton-grid">
          <div className="skeleton shimmer thumb-col" />
          <div className="skeleton shimmer main-img-skel" />
          <div className="details-skel">
            <div className="skeleton shimmer text-skel" style={{ height: "30px", width: "80%" }} />
            <div className="skeleton shimmer text-skel" style={{ height: "20px", width: "40%", marginTop: "10px" }} />
            <div className="skeleton shimmer box-skel" style={{ height: "80px", marginTop: "30px" }} />
            <div className="skeleton shimmer box-skel" style={{ height: "150px", marginTop: "20px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <Link href="/" className="btn-primary">Return to Store</Link>
      </div>
    );
  }

  // --- VARIABLES ---
  const images = product.images || [];
  const price = parseFloat(product.price) || 0;
  const regularPrice = parseFloat(product.regular_price) || 0;
  const salePrice = parseFloat(product.sale_price) || 0;
  const onSale = product.on_sale && salePrice > 0;
  const discount = onSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;
  const rating = parseFloat(product.average_rating) || 0;
  const reviewCount = product.rating_count || 0;
  const inStock = product.stock_status === "instock";

  return (
    <div className="product-page-wrapper">
      
      {/* --- BREADCRUMBS --- */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={14} />
        {product.categories?.[0] && (
          <>
            <Link href={`/category/${product.categories[0].id}`}>{product.categories[0].name}</Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="current-crumb" dangerouslySetInnerHTML={{ __html: product.name }} />
      </div>

      <div className="main-content-grid">
        
        {/* ================= LEFT / TOP: GALLERY & DETAILS ================= */}
        <div className="product-top-section">
          
          {/* GALLERY */}
          <div className="gallery-container">
            <div className="thumbnail-column">
              <button className="nav-arrow"><ChevronUp size={20} color="#666" /></button>
              <div className="thumbnail-list">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`thumb-btn ${selectedImage === i ? "active" : ""}`}
                  >
                    <img src={img.src} alt="" />
                  </button>
                ))}
              </div>
              <button className="nav-arrow"><ChevronDown size={20} color="#666" /></button>
            </div>
            
            <div className="main-image-wrapper">
              <button className="wishlist-icon"><Heart size={24} color="#fc2779" /></button>
              <img 
                src={images[selectedImage]?.src || "/placeholder.jpg"} 
                alt={product.name}
                className="main-image"
              />
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="info-container">
            <h1 className="product-title" dangerouslySetInnerHTML={{ __html: product.name }} />
            
            {/* Reviews */}
            <div className="rating-block">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(rating) ? "#333" : "none"} stroke={i < Math.round(rating) ? "#333" : "#ccc"} />
                ))}
                <span className="rating-text">{rating > 0 ? rating : 'No'} / 5</span>
              </div>
              <span className="review-count">{reviewCount} ratings & {Math.floor(reviewCount * 0.1)} reviews</span>
            </div>

            {/* Price */}
            <div className="price-section">
              {onSale ? (
                <>
                  <span className="mrp">₹{regularPrice}</span>
                  <span className="current-price">₹{price}</span>
                  <span className="discount">{discount}% Off</span>
                </>
              ) : (
                <span className="current-price">₹{price}</span>
              )}
              <div className="tax-inclusive">inclusive of all taxes</div>
            </div>

            {/* Coupons Section (Static UI match) */}
            <div className="coupons-section">
              <div className="coupons-header">
                <h3>Collect Multiple Coupons</h3>
                <span className="how-to">How to <Info size={14} /></span>
              </div>
              <ul className="coupon-rules">
                <li>Add products worth the minimum order value to bag</li>
                <li>Once you add, Coupon will get auto applied</li>
              </ul>
              <div className="coupon-card">
                <div className="coupon-icon-area">
                  <TicketPercent size={24} color="#fc2779" />
                  <div className="percent-badge">%</div>
                </div>
                <div className="coupon-details">
                  <h4>Extra 15% Off upto ₹300 Max</h4>
                  <p>Extra 15% Off upto ₹300 Max On your 1st order abov... <span>see details</span></p>
                </div>
                <div className="coupon-action-row">
                  <span className="code">NEW15</span>
                  <button className="collect-btn">Collect</button>
                </div>
              </div>
            </div>

            {/* Delivery & Cart Actions */}
            <div className="action-delivery-container">
              <div className="actions-row">
                <button 
                  onClick={handleAddToCart} 
                  disabled={!inStock}
                  className={`btn-add-to-bag ${addedToCart ? "added" : ""}`}
                >
                  {addedToCart ? "Added to Bag" : "Add to Bag"}
                </button>
                
                <div className="delivery-check">
                  <div className="delivery-header">
                    <MapPin size={16} /> Delivery Options
                  </div>
                  <div className="pin-input-group">
                    <input type="text" placeholder="Enter pincode" maxLength={6} />
                    <button>Check</button>
                  </div>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="badge"><ShieldCheck size={18} /> 100% Genuine Products</div>
                <div className="badge"><RotateCcw size={18} /> Easy Return Policy</div>
                <div className="badge sold-by">Sold by : NYKAA E RETA...</div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM: TABS & STICKY CART ================= */}
        <div className="product-bottom-section">
          
          <div className="details-content-area">
            {/* Description Tab Section */}
            <h2 className="section-title">Product Description</h2>
            <div className="tabs-wrapper">
              <div className="tabs-header">
                <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
                <button className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>Ingredients</button>
                <button className={`tab-btn ${activeTab === 'howto' ? 'active' : ''}`} onClick={() => setActiveTab('howto')}>How To Use</button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className={`description-body ${isDescExpanded ? 'expanded' : ''}`}>
                    <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "No description available." }} />
                    <button className="read-more-btn" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                      {isDescExpanded ? 'Read Less' : 'Read More'} <ChevronDown size={16} />
                    </button>
                  </div>
                )}
                {activeTab === 'ingredients' && <div className="tab-placeholder">Ingredient information is currently unavailable.</div>}
                {activeTab === 'howto' && <div className="tab-placeholder">Usage instructions are currently unavailable.</div>}
              </div>
            </div>

            {/* Ratings & Reviews Section (Static Structure matching screenshot) */}
            
            {/* <h2 className="section-title mt-8">Product Details</h2> */}
            {/* <div className="tabs-wrapper mb-8">
              <div className="tabs-header">
                <button className="tab-btn active">Ratings & Reviews</button>
              </div>
              <div className="reviews-content">
                <div className="review-summary-row">
                  <div className="overall-rating">
                    <span className="big-score">{rating > 0 ? rating : '0'}<span>/5</span></span>
                    <div className="rating-meta">
                      <span className="title">Overall Rating</span>
                      <span className="subtitle">{reviewCount} verified ratings</span>
                    </div>
                  </div>
                  <div className="write-review-prompt">
                    <p>Write a review and win 100 reward points !</p>
                    <button className="btn-outline">Write Review</button>
                  </div>
                </div>

                <div className="customer-photos">
                  <h4>Photos From Customers</h4>
                  <div className="photo-list hide-scroll">
                    {[1,2,3,4,5,6].map((num) => (
                       <div key={num} className="review-thumb">
                         <img src={images[0]?.src || "/placeholder.jpg"} alt="review" />
                       </div>
                    ))}
                  </div>
                </div>

                <div className="useful-review">
                  <h4>Most Useful Review</h4>
                  <div className="review-card">
                    <div className="reviewer-info">
                      <div className="avatar">M</div>
                      <div className="details">
                        <span className="name">Mamta Rani</span>
                        <span className="verified"><CheckCircle2 size={12} fill="#fc2779" color="#fff" /> Verified Buyers</span>
                      </div>
                    </div>
                    <div className="review-body">
                      <div className="review-header">
                        <span className="star-badge">5 <Star size={12} fill="#fff" /></span>
                        <span className="date">10/05/2026</span>
                      </div>
                      <h5>"Good"</h5>
                      <p>It is a deep-absorbing, gel-based oil that gives skin shine but is not at all greasy.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div> */}
          </div>

          {/* Sticky Right Sidebar (Desktop only) */}
          <div className="sticky-sidebar">
            <div className="sticky-card">
              <img src={images[0]?.src || "/placeholder.jpg"} alt={product.name} />
              <div className="sticky-details">
                <p className="title" dangerouslySetInnerHTML={{ __html: product.name }} />
                <div className="price-row">
                  <span className="mrp">₹{regularPrice}</span>
                  <span className="current">₹{price}</span>
                  {onSale && <span className="discount">{discount}% Off</span>}
                </div>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < Math.round(rating) ? "#333" : "none"} stroke={i < Math.round(rating) ? "#333" : "#ccc"} />
                  ))}
                  <span className="count">( {reviewCount} )</span>
                </div>
              </div>
              <button 
                onClick={handleAddToCart} 
                disabled={!inStock}
                className="btn-add-to-bag sticky-btn"
              >
                Add to Bag
              </button>
            </div>
          </div>

        </div>
        
        {/* --- RELATED PRODUCTS --- */}
        {related.length > 0 && (
          <div className="related-section">
            <h2 className="section-title text-center">Similar Products</h2>
            <div className="related-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        /* ================= GLOBAL & RESETS ================= */
        .product-page-wrapper {
          background-color: #f3f4f5;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #001325;
          padding-bottom: 60px;
        }
        
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        button { cursor: pointer; border: none; background: transparent; font-family: inherit; }
        ul { padding: 0; margin: 0; list-style: none; }

        /* ================= BREADCRUMBS ================= */
        .breadcrumb {
          background: #fff;
          padding: 12px 5%;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #757575;
          border-bottom: 1px solid #e5e5e5;
          white-space: nowrap;
          overflow-x: auto;
        }
        .breadcrumb a { color: #757575; text-decoration: none; }
        .breadcrumb a:hover { color: #fc2779; }
        .current-crumb { color: #001325; font-weight: 500; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }

        /* ================= MAIN LAYOUT ================= */
        .main-content-grid {
          max-width: 1280px;
          margin: 20px auto;
          padding: 0 5%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* --- TOP SECTION (Image & Core Info) --- */
        .product-top-section {
          background: #fff;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .product-top-section { grid-template-columns: 55% 45%; }
        }

        /* --- GALLERY --- */
        .gallery-container {
          display: flex;
          padding: 20px;
          border-right: 1px solid #f0f0f0;
          height: 100%;
        }
        .thumbnail-column {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 70px;
          margin-right: 20px;
        }
        @media (min-width: 768px) { .thumbnail-column { display: flex; } }
        
        .nav-arrow {
          background: #f9f9f9;
          border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #eaeaea;
        }
        .thumbnail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          max-height: 400px;
          padding: 4px 0;
        }
        .thumb-btn {
          width: 60px; height: 60px;
          border: 1px solid #eaeaea;
          border-radius: 4px;
          padding: 4px;
          transition: all 0.2s;
        }
        .thumb-btn.active { border: 1px solid #fc2779; box-shadow: 0 0 4px rgba(252, 39, 121, 0.3); }
        .thumb-btn img { width: 100%; height: 100%; object-fit: contain; }

        .main-image-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          border-radius: 8px;
          min-height: 350px;
        }
        .wishlist-icon {
          position: absolute;
          top: 16px; right: 16px;
          background: #fff;
          border-radius: 50%;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .main-image {
          max-width: 80%;
          max-height: 450px;
          object-fit: contain;
        }

        /* --- PRODUCT INFO RIGHT SIDE --- */
        .info-container { padding: 24px; display: flex; flex-direction: column; }
        
        .product-title {
          font-size: 20px;
          line-height: 1.4;
          font-weight: 500;
          color: #001325;
          margin: 0 0 12px 0;
        }
        
        .rating-block {
          display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .stars { display: flex; align-items: center; gap: 2px; }
        .rating-text { font-size: 14px; font-weight: 500; margin-left: 4px; }
        .review-count { font-size: 13px; color: #757575; }

        .price-section { margin-bottom: 24px; }
        .price-section .mrp { font-size: 16px; color: #757575; text-decoration: line-through; margin-right: 8px; }
        .price-section .current-price { font-size: 24px; font-weight: 700; color: #001325; margin-right: 12px; }
        .price-section .discount { font-size: 14px; font-weight: 600; color: #008945; }
        .tax-inclusive { font-size: 12px; color: #757575; margin-top: 4px; }

        /* --- COUPONS SECTION --- */
        .coupons-section {
          margin-bottom: 30px;
        }
        .coupons-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
        }
        .coupons-header h3 { font-size: 16px; font-weight: 600; margin: 0; }
        .how-to { font-size: 13px; color: #fc2779; font-weight: 500; display: flex; align-items: center; gap: 4px; cursor: pointer; }
        
        .coupon-rules { margin-bottom: 16px; padding-left: 16px; }
        .coupon-rules li { font-size: 13px; color: #666; margin-bottom: 6px; position: relative; list-style-type: disc; color: #fc2779; }
        .coupon-rules li::marker { color: #fc2779; font-size: 10px; }
        .coupon-rules li span { color: #666; } /* Reset text color if using custom bullet */

        .coupon-card {
          border: 1px dashed #fc2779;
          border-radius: 8px;
          background: #fff5f8;
          padding: 16px;
          position: relative;
        }
        .coupon-icon-area { position: absolute; left: 16px; top: 16px; }
        .percent-badge { 
          position: absolute; bottom: -4px; right: -4px; 
          background: #fc2779; color: white; font-size: 10px; font-weight: bold; 
          border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;
        }
        .coupon-details { margin-left: 40px; margin-bottom: 12px; }
        .coupon-details h4 { margin: 0 0 4px 0; font-size: 14px; color: #001325; font-weight: 600; }
        .coupon-details p { margin: 0; font-size: 12px; color: #757575; line-height: 1.4; }
        .coupon-details span { color: #333; font-weight: 500; text-decoration: underline; cursor: pointer; }
        
        .coupon-action-row {
          background: #fff;
          border: 1px dashed #ffb3d1;
          border-radius: 4px;
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 12px;
          margin-left: 40px;
        }
        .coupon-action-row .code { font-size: 13px; font-weight: 600; color: #757575; }
        .coupon-action-row .collect-btn { color: #fc2779; font-weight: 600; font-size: 14px; }

        /* --- ACTION & DELIVERY --- */
        .action-delivery-container {
          border-top: 1px solid #f0f0f0;
          padding-top: 24px;
        }
        .actions-row {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media (min-width: 600px) {
          .actions-row { flex-direction: row; align-items: stretch; }
        }

        .btn-add-to-bag {
          background: #fc2779;
          color: white;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          padding: 16px 24px;
          flex: 1;
          transition: background 0.2s;
        }
        .btn-add-to-bag:hover { background: #e80071; }
        .btn-add-to-bag.added { background: #008945; }
        
        .delivery-check {
          flex: 1;
          border-left: none;
          padding-left: 0;
        }
        @media (min-width: 600px) {
          .delivery-check { border-left: 1px solid #f0f0f0; padding-left: 20px; }
        }
        
        .delivery-header { font-size: 14px; color: #333; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .pin-input-group {
          display: flex;
          border: 1px solid #eaeaea;
          border-radius: 4px;
          overflow: hidden;
        }
        .pin-input-group input {
          flex: 1; padding: 12px; border: none; outline: none; font-size: 14px;
        }
        .pin-input-group button {
          color: #fc2779; font-weight: 600; padding: 0 16px; font-size: 14px; background: #fff; border-left: 1px solid #eaeaea;
        }

        .trust-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          background: #f9f9f9;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 12px;
          color: #555;
          align-items: center;
        }
        .trust-badges .badge { display: flex; align-items: center; gap: 6px; }
        .trust-badges .sold-by { margin-left: auto; color: #333; font-weight: 500; }

        /* ================= BOTTOM SECTION (Tabs & Sticky) ================= */
        .product-bottom-section {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .product-bottom-section { grid-template-columns: 1fr 300px; gap: 30px; }
        }

        .section-title { font-size: 18px; font-weight: 600; color: #001325; margin: 0 0 16px 0; }
        .mt-8 { margin-top: 32px; }
        .mb-8 { margin-bottom: 32px; }

        /* --- TABS --- */
        .tabs-wrapper { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden; }
        .tabs-header { display: flex; border-bottom: 1px solid #f0f0f0; }
        .tab-btn {
          padding: 16px 24px;
          font-size: 15px;
          font-weight: 500;
          color: #666;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .tab-btn.active { color: #fc2779; border-bottom-color: #fc2779; }
        
        .tab-content { padding: 24px; }
        .tab-placeholder { color: #757575; font-size: 14px; text-align: center; padding: 40px 0; }
        
        /* Description Content styling */
        .description-body {
          color: #444; font-size: 14px; line-height: 1.6;
          max-height: 200px; overflow: hidden; position: relative;
        }
        .description-body.expanded { max-height: none; }
        .description-body p { margin-bottom: 12px; }
        .description-body ul { padding-left: 20px; margin-bottom: 12px; }
        .description-body li { list-style: disc; margin-bottom: 6px; }
        .description-body.expanded::after { display: none; }
        .description-body:not(.expanded)::after {
          content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 60px;
          background: linear-gradient(to top, white, transparent); pointer-events: none;
        }
        
        .read-more-btn {
          display: flex; align-items: center; gap: 4px;
          color: #fc2779; font-weight: 600; font-size: 14px;
          margin-top: 16px; padding: 0;
        }

        /* --- REVIEWS STRUCTURE --- */
        .reviews-content { padding: 24px; }
        .review-summary-row {
          display: flex; justify-content: space-between; align-items: center;
          padding-bottom: 24px; border-bottom: 1px solid #f0f0f0; margin-bottom: 24px;
          flex-wrap: wrap; gap: 20px;
        }
        .overall-rating { display: flex; align-items: center; gap: 16px; }
        .big-score { font-size: 40px; font-weight: 700; color: #001325; line-height: 1; }
        .big-score span { font-size: 20px; color: #757575; font-weight: 500; }
        .rating-meta { display: flex; flex-direction: column; }
        .rating-meta .title { font-size: 16px; font-weight: 500; color: #001325; }
        .rating-meta .subtitle { font-size: 13px; color: #757575; }
        
        .write-review-prompt p { font-size: 13px; color: #555; margin: 0 0 8px 0; }
        .btn-outline {
          border: 1px solid #fc2779; color: #fc2779; font-weight: 600;
          padding: 8px 24px; border-radius: 4px; font-size: 14px; transition: background 0.2s;
        }
        .btn-outline:hover { background: #fff5f8; }

        .customer-photos h4, .useful-review h4 { font-size: 15px; font-weight: 600; margin: 0 0 16px 0; color: #001325; }
        .photo-list { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 32px; }
        .review-thumb {
          width: 80px; height: 80px; flex-shrink: 0;
          border: 1px solid #eaeaea; border-radius: 4px; padding: 2px;
        }
        .review-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .review-card { padding: 16px 0; }
        .reviewer-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .reviewer-info .avatar {
          width: 40px; height: 40px; background: #ffe6ef; color: #fc2779;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 18px;
        }
        .reviewer-info .details { display: flex; flex-direction: column; }
        .reviewer-info .name { font-size: 14px; font-weight: 500; color: #333; }
        .reviewer-info .verified { font-size: 12px; color: #757575; display: flex; align-items: center; gap: 4px; }
        
        .review-body .review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .star-badge {
          background: #008945; color: white; padding: 2px 6px; border-radius: 2px;
          font-size: 12px; font-weight: bold; display: flex; align-items: center; gap: 2px;
        }
        .review-body .date { font-size: 12px; color: #999; }
        .review-body h5 { font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #001325; }
        .review-body p { font-size: 14px; color: #555; line-height: 1.5; margin: 0; }

        /* --- STICKY SIDEBAR --- */
        .sticky-sidebar { display: none; }
        @media (min-width: 1024px) {
          .sticky-sidebar { display: block; position: sticky; top: 100px; }
        }
        .sticky-card {
          background: #fff; padding: 20px; border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex; flex-direction: column; gap: 16px;
        }
        .sticky-card img { width: 100%; height: 180px; object-fit: contain; border-radius: 4px; }
        .sticky-details .title { font-size: 14px; font-weight: 500; margin: 0 0 12px 0; line-height: 1.4; }
        .sticky-details .price-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .sticky-details .mrp { font-size: 14px; color: #999; text-decoration: line-through; }
        .sticky-details .current { font-size: 18px; font-weight: 700; }
        .sticky-details .discount { font-size: 12px; color: #008945; font-weight: 600; }
        .sticky-details .stars { display: flex; align-items: center; gap: 2px; }
        .sticky-details .count { font-size: 12px; color: #757575; margin-left: 6px; }
        .sticky-btn { padding: 12px; font-size: 15px; }

        /* --- RELATED --- */
        .related-section { margin-top: 40px; }
        .text-center { text-align: center; }
        .related-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;
        }

        /* --- UTILS / SKELETON --- */
        .page-container { max-width: 1280px; margin: 0 auto; padding: 40px 5%; }
        .skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .skeleton { background: #e0e0e0; border-radius: 4px; }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%; animation: shimmerAnim 1.5s infinite;
        }
        @keyframes shimmerAnim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .thumb-col { width: 70px; height: 300px; display: none; }
        @media(min-width: 768px){ .thumb-col { display: block; } }
        .main-img-skel { height: 400px; }
        
        .not-found-container { text-align: center; padding: 100px 20px; background: #fff; height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .not-found-container h2 { font-size: 24px; margin-bottom: 20px; }
        .btn-primary { background: #fc2779; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; }
      `}</style>
    </div>
  );
}