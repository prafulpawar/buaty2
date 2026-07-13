"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Star, ChevronRight, ChevronUp, ChevronDown, 
  MapPin, ShieldCheck, RotateCcw
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
  const [mobileIndex, setMobileIndex] = useState(0); // State for mobile slider dots
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState("description");
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const isNumeric = /^\d+$/.test(params.id);
        const queryParam = isNumeric ? `include=${params.id}` : `slug=${params.id}`;
        
        const res = await fetch(`/api/wc/products?${queryParam}`);
        const data = await res.json();
        
        if (res.ok && Array.isArray(data) && data.length > 0) {
          const productData = data[0]; 
          setProduct(productData);
          
          if (productData.categories?.[0]?.id) {
            const relRes = await fetch(`/api/wc/products?category=${productData.categories[0].id}&per_page=5&status=publish`);
            if (relRes.ok) {
              const relData = await relRes.json();
              setRelated(Array.isArray(relData) ? relData.filter((p) => p.id !== productData.id).slice(0, 4) : []);
            }
          }
        } else {
          console.error("Product not found or API error:", data);
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setProduct(null);
      }
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleMobileScroll = (e) => {
    // Calculate which image is currently in view based on scroll position
    const index = Math.round(e.target.scrollLeft / e.target.clientWidth);
    setMobileIndex(index);
  };

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
        <p style={{ color: "#666", marginBottom: "20px" }}>The product you are looking for does not exist or has been removed.</p>
        <Link href="/" className="btn-primary">Return to Store</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [{ src: "/placeholder.jpg" }];
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
      
      {/* BREADCRUMBS */}
      <div className="breadcrumb hide-scroll">
        <Link href="/">Home</Link>
        <ChevronRight size={14} className="shrink-0" />
        {product.categories?.[0] && (
          <>
            <Link href={`/category/${product.categories[0].id}`}>{product.categories[0].name}</Link>
            <ChevronRight size={14} className="shrink-0" />
          </>
        )}
        <span className="current-crumb" dangerouslySetInnerHTML={{ __html: product.name }} />
      </div>

      <div className="main-content-grid">
        
        {/* TOP SECTION: GALLERY & DETAILS */}
        <div className="product-top-section">
          
          {/* GALLERY */}
          <div className="gallery-container">
            {/* Desktop Thumbnails (Hidden on mobile) */}
            <div className="thumbnail-column">
              <button className="nav-arrow"><ChevronUp size={20} color="#666" /></button>
              <div className="thumbnail-list hide-scroll">
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
              
              {/* DESKTOP IMAGE VIEW (Hidden on Mobile) */}
              <div className="desktop-image-view">
                <img 
                  src={images[selectedImage]?.src || "/placeholder.jpg"} 
                  alt={product.name}
                  className="main-image"
                />
              </div>

              {/* MOBILE SLIDER VIEW (Hidden on Desktop) */}
              <div className="mobile-slider-view hide-scroll" onScroll={handleMobileScroll}>
                {images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img.src} 
                    alt={`${product.name} image ${idx + 1}`}
                    className="slider-image"
                  />
                ))}
              </div>

              {/* MOBILE DOTS INDICATOR */}
              {images.length > 1 && (
                <div className="mobile-dots">
                  {images.map((_, i) => (
                    <div key={i} className={`dot ${i === mobileIndex ? 'active' : ''}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="info-container">
            <h1 className="product-title" dangerouslySetInnerHTML={{ __html: product.name }} />
            
            {/* Reviews */}
            <div className="rating-block">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(rating) ? "#333" : "none"} stroke={i < Math.round(rating) ? "#333" : "#ccc"} />
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

            {/* Delivery & Cart Actions - FIXED LAYOUT */}
            <div className="action-delivery-container">
              <div className="actions-row">
                
                {/* Button Wrapper */}
                <div className="action-btn-wrapper">
                  <button 
                    onClick={handleAddToCart} 
                    disabled={!inStock}
                    className={`btn-add-to-bag ${addedToCart ? "added" : ""}`}
                  >
                    {addedToCart ? "Added to Bag" : "Add to Bag"}
                  </button>
                </div>
                
                {/* Delivery Wrapper */}
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
                <div className="badge"><ShieldCheck size={16} color="#fc2779" /> <span>100% Genuine</span></div>
                <div className="badge"><RotateCcw size={16} color="#fc2779" /> <span>Easy Return Policy</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM: TABS & STICKY CART */}
        <div className="product-bottom-section">
          
          <div className="details-content-area">
            {/* Description Tab Section */}
            <div className="tabs-wrapper">
              <div className="tabs-header hide-scroll">
                <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
                <button className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>Ingredients</button>
                <button className={`tab-btn ${activeTab === 'howto' ? 'active' : ''}`} onClick={() => setActiveTab('howto')}>How To Use</button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className={`description-body ${isDescExpanded ? 'expanded' : ''}`}>
                    <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "No description available." }} />
                    <button className="read-more-btn" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                      {isDescExpanded ? 'Read Less' : 'Read More'} {isDescExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                )}
                {activeTab === 'ingredients' && <div className="tab-placeholder">Ingredient information is currently unavailable.</div>}
                {activeTab === 'howto' && <div className="tab-placeholder">Usage instructions are currently unavailable.</div>}
              </div>
            </div>
          </div>

          {/* Sticky Right Sidebar (Desktop only) */}
          <div className="sticky-sidebar">
            <div className="sticky-card">
              <img src={images[0]?.src || "/placeholder.jpg"} alt={product.name} />
              <div className="sticky-details">
                <p className="title" dangerouslySetInnerHTML={{ __html: product.name }} />
                <div className="price-row">
                  {onSale && <span className="mrp">₹{regularPrice}</span>}
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
        
        {/* RELATED PRODUCTS */}
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
          background-color: #f3f4f6;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #001325;
          padding-bottom: clamp(40px, 8vw, 80px);
          overflow-x: hidden;
        }
        
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .shrink-0 { flex-shrink: 0; }
        
        button { cursor: pointer; border: none; background: transparent; font-family: inherit; outline: none; }
        ul { padding: 0; margin: 0; list-style: none; }

        /* ================= BREADCRUMBS ================= */
        .breadcrumb {
          background: #fff;
          padding: clamp(10px, 2vw, 12px) clamp(16px, 5vw, 5%);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: clamp(11px, 2.5vw, 13px);
          color: #757575;
          border-bottom: 1px solid #e5e5e5;
          white-space: nowrap;
          overflow-x: auto;
          width: 100%;
        }
        .breadcrumb a { color: #757575; text-decoration: none; }
        .breadcrumb a:hover { color: #fc2779; }
        .current-crumb { color: #001325; font-weight: 500; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }

        /* ================= MAIN LAYOUT ================= */
        .main-content-grid {
          max-width: 1280px;
          margin: clamp(16px, 3vw, 24px) auto;
          padding: 0 clamp(12px, 4vw, 5%);
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 3vw, 24px);
        }

        /* --- TOP SECTION (Image & Core Info) --- */
        .product-top-section {
          background: #fff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          border: 1px solid #eaeaea;
          overflow: hidden;
        }
        @media (min-width: 900px) {
          .product-top-section { flex-direction: row; }
        }

        /* --- GALLERY --- */
        .gallery-container {
          display: flex;
          padding: clamp(16px, 3vw, 24px);
          border-bottom: 1px solid #eaeaea;
          width: 100%;
          position: relative; /* For dots positioning */
        }
        @media (min-width: 900px) {
          .gallery-container {
            width: 50%;
            border-bottom: none;
            border-right: 1px solid #eaeaea;
          }
        }
        
        .thumbnail-column {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 70px;
          margin-right: clamp(12px, 2vw, 20px);
          flex-shrink: 0;
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
          max-height: clamp(300px, 50vh, 450px);
          padding: 4px 0;
          width: 100%;
        }
        .thumb-btn {
          width: clamp(50px, 5vw, 60px); 
          height: clamp(50px, 5vw, 60px);
          border: 1px solid #eaeaea;
          border-radius: 6px;
          padding: 4px;
          transition: all 0.2s;
        }
        .thumb-btn.active { border: 1px solid #fc2779; box-shadow: 0 0 4px rgba(252, 39, 121, 0.3); }
        .thumb-btn img { width: 100%; height: 100%; object-fit: contain; }

        .main-image-wrapper {
          flex: 1;
          position: relative;
          background: #ffffff;
          border-radius: 8px;
          min-height: clamp(250px, 40vh, 450px);
          width: 100%;
          overflow: hidden;
        }

        /* Desktop specific single image view */
        .desktop-image-view {
          display: none;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
        .main-image {
          width: 100%;
          max-width: 85%;
          max-height: clamp(250px, 40vh, 450px);
          object-fit: contain;
        }

        /* Mobile specific slider view */
        .mobile-slider-view {
          display: flex;
          width: 100%;
          height: 100%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .slider-image {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          scroll-snap-align: center;
          padding: 24px;
        }

        /* Dots indicator */
        .mobile-dots {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 6px;
          z-index: 10;
        }
        .mobile-dots .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e0e0e0;
          transition: all 0.3s ease;
        }
        .mobile-dots .dot.active {
          background: #fc2779;
          width: 14px;
          border-radius: 4px;
        }

        /* Toggle Slider vs Single Image based on Screen Size */
        @media (min-width: 900px) {
          .desktop-image-view { display: flex; }
          .mobile-slider-view { display: none; }
          .mobile-dots { display: none; }
        }

        /* --- PRODUCT INFO RIGHT SIDE --- */
        .info-container { 
          padding: clamp(20px, 4vw, 32px); 
          display: flex; 
          flex-direction: column; 
          width: 100%;
        }
        @media (min-width: 900px) {
          .info-container { width: 50%; }
        }
        
        .product-title {
          font-size: clamp(20px, 3vw, 24px);
          line-height: 1.4;
          font-weight: 600;
          color: #111;
          margin: 0 0 12px 0;
          word-wrap: break-word;
        }
        
        .rating-block {
          display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; margin-bottom: 16px;
        }
        .stars { display: flex; align-items: center; gap: 2px; }
        .rating-text { font-size: clamp(13px, 2vw, 14px); font-weight: 500; margin-left: 4px; }
        .review-count { font-size: clamp(12px, 1.8vw, 13px); color: #757575; }

        .price-section { margin-bottom: clamp(24px, 4vw, 32px); } 
        .price-section .mrp { font-size: clamp(14px, 2vw, 16px); color: #757575; text-decoration: line-through; margin-right: 8px; }
        .price-section .current-price { font-size: clamp(22px, 3vw, 26px); font-weight: 700; color: #111; margin-right: 12px; }
        .price-section .discount { font-size: clamp(12px, 2vw, 14px); font-weight: 600; color: #008945; }
        .tax-inclusive { font-size: 12px; color: #757575; margin-top: 6px; }

        /* --- ACTION & DELIVERY (FIXED FLEX ISSUE) --- */
        .action-delivery-container { border-top: 1px solid #eaeaea; padding-top: clamp(20px, 4vw, 28px); }
        
        .actions-row { 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
          margin-bottom: 24px; 
        }
        
        /* Desktop Side-by-Side */
        @media (min-width: 600px) { 
          .actions-row { 
            flex-direction: row; 
            align-items: flex-end; 
          } 
        }

        .action-btn-wrapper {
          flex: 1; 
          width: 100%;
        }

        .btn-add-to-bag { 
          background: #fc2779; 
          color: white; 
          font-size: clamp(14px, 2vw, 16px); 
          font-weight: 600; 
          border-radius: 4px; 
          padding: 0 24px; 
          height: 48px; 
          width: 100%;
          display: flex; 
          align-items: center; 
          justify-content: center;
          white-space: nowrap; 
          transition: background 0.2s; 
        }
        .btn-add-to-bag:hover { background: #e80071; }
        .btn-add-to-bag.added { background: #008945; }
        
        .delivery-check { 
          flex: 1.2; 
          width: 100%; 
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        .delivery-header { 
          font-size: clamp(13px, 2vw, 14px); 
          color: #333; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          margin-bottom: 8px; 
          height: 20px; 
        }
        
        .pin-input-group { 
          display: flex; 
          border: 1px solid #eaeaea; 
          border-radius: 4px; 
          overflow: hidden; 
          width: 100%; 
          height: 48px; 
        }
        
        .pin-input-group input { 
          flex: 1; 
          padding: 0 16px; 
          border: none; 
          outline: none; 
          font-size: clamp(13px, 2vw, 14px); 
          min-width: 0; 
        }
        
        .pin-input-group button { 
          color: #fc2779; 
          font-weight: 600; 
          padding: 0 clamp(12px, 2vw, 20px); 
          font-size: clamp(13px, 2vw, 14px); 
          background: #fff; 
          border-left: 1px solid #eaeaea; 
        }

        /* --- TRUST BADGES --- */
        .trust-badges { 
          display: flex; flex-wrap: wrap; gap: clamp(12px, 2vw, 24px); 
          background: #f9fafb; padding: clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px); 
          border-radius: 6px; border: 1px solid #f0f0f0;
          align-items: center; justify-content: flex-start;
        }
        .trust-badges .badge { 
          display: flex; align-items: center; gap: 8px; 
          font-size: clamp(12px, 1.8vw, 13px); font-weight: 500; color: #444; 
        }

        /* ================= BOTTOM SECTION (Tabs & Sticky) ================= */
        .product-bottom-section { display: grid; grid-template-columns: 1fr; gap: clamp(20px, 3vw, 30px); align-items: start; }
        
        @media (min-width: 1024px) { 
          .product-bottom-section { grid-template-columns: minmax(0, 1fr) 320px; } 
        }

        .section-title { font-size: clamp(18px, 2.5vw, 20px); font-weight: 600; color: #111; margin: 0 0 16px 0; }

        /* --- TABS --- */
        .tabs-wrapper { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.03); border: 1px solid #eaeaea; overflow: hidden; width: 100%; }
        .tabs-header { 
          display: flex; border-bottom: 1px solid #eaeaea; 
          overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch;
        }
        .tab-btn { 
          padding: clamp(16px, 2vw, 20px) clamp(20px, 3vw, 32px); 
          font-size: clamp(14px, 2vw, 15px); font-weight: 500; color: #666; 
          border-bottom: 2px solid transparent; transition: all 0.2s; 
          white-space: nowrap; flex-shrink: 0;
        }
        .tab-btn.active { color: #fc2779; border-bottom-color: #fc2779; color: #111;}
        
        .tab-content { padding: clamp(20px, 4vw, 32px); }
        .tab-placeholder { color: #757575; font-size: clamp(13px, 2vw, 14px); text-align: center; padding: 40px 0; }
        
        /* Description Content styling */
        .description-body { 
          color: #444; font-size: clamp(14px, 2vw, 15px); line-height: 1.7; 
          max-height: 250px; overflow: hidden; position: relative; 
          word-wrap: break-word;
        }
        .description-body.expanded { max-height: none; }
        .description-body p { margin-bottom: 14px; }
        .description-body ul { padding-left: 20px; margin-bottom: 14px; }
        .description-body li { list-style: disc; margin-bottom: 8px; }
        .description-body.expanded::after { display: none; }
        .description-body:not(.expanded)::after { 
          content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 80px; 
          background: linear-gradient(to top, white, transparent); pointer-events: none; 
        }
        
        .read-more-btn { display: flex; align-items: center; gap: 4px; color: #fc2779; font-weight: 600; font-size: 14px; margin-top: 16px; padding: 0; }

        /* --- STICKY SIDEBAR --- */
        .sticky-sidebar { display: none; }
        @media (min-width: 1024px) { 
          .sticky-sidebar { display: block; position: sticky; top: 100px; width: 100%; align-self: start; } 
        }
        
        .sticky-card { 
          background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #eaeaea;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 16px; 
        }
        .sticky-card img { width: 100%; height: 200px; object-fit: contain; border-radius: 8px; }
        .sticky-details .title { 
          font-size: 15px; font-weight: 500; margin: 0 0 12px 0; line-height: 1.4; color: #111;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; 
        }
        .sticky-details .price-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .sticky-details .mrp { font-size: 14px; color: #999; text-decoration: line-through; }
        .sticky-details .current { font-size: 20px; font-weight: 700; color: #111; }
        .sticky-details .discount { font-size: 13px; color: #008945; font-weight: 600; }
        .sticky-details .stars { display: flex; align-items: center; gap: 2px; }
        .sticky-details .count { font-size: 12px; color: #757575; margin-left: 6px; }
        .sticky-btn { padding: 0; height: 48px; font-size: 15px; }

        /* --- RELATED --- */
        .related-section { margin-top: clamp(40px, 8vw, 60px); }
        .text-center { text-align: center; }
        .related-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
          gap: clamp(16px, 3vw, 24px); 
        }
        @media (min-width: 600px) {
          .related-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        }

        /* --- UTILS / SKELETON --- */
        .page-container { max-width: 1280px; margin: 0 auto; padding: 40px 5%; width: 100%; }
        .skeleton-grid { display: grid; grid-template-columns: 1fr; gap: clamp(20px, 4vw, 40px); }
        @media (min-width: 900px) { .skeleton-grid { grid-template-columns: 1fr 1fr; } }
        
        .skeleton { background: #e0e0e0; border-radius: 4px; width: 100%; }
        .shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmerAnim 1.5s infinite; }
        @keyframes shimmerAnim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        .thumb-col { width: 70px; height: 300px; display: none; }
        @media(min-width: 768px){ .thumb-col { display: block; } }
        .main-img-skel { height: clamp(300px, 50vh, 400px); }
        
        .not-found-container { text-align: center; padding: clamp(40px, 10vw, 100px) 20px; background: #fff; height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .not-found-container h2 { font-size: clamp(20px, 4vw, 24px); margin-bottom: 10px; }
        .btn-primary { background: #fc2779; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; }
      `}</style>
    </div>
  );
}