"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; 

export default function StoreFrontUI() {
  const [apiProducts, setApiProducts] = useState([]);

  // Fetch products from your API
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/wc/products?per_page=50&status=publish");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // Filter out products that don't have images
          const validProducts = data.filter(p => p.images && p.images.length > 0);
          if (validProducts.length > 0) {
            setApiProducts(validProducts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch API products:", err);
      }
    }
    loadProducts();
  }, []);

  // Helper to get a product
  const getProduct = (index) => {
    if (apiProducts.length === 0) {
      return {
        image: `https://via.placeholder.com/800x600/FCE4EC/E8437F?text=Loading+${index + 1}`,
        link: "#",
      };
    }
    const product = apiProducts[index % apiProducts.length];
    return {
      image: product.images[0].src,
      link: `/product/${product.slug || product.id}`, 
    };
  };

  return (
    <div className="sf-container">
      
      {/* 3. TOP BRANDS SCROLL */}
      <div className="sf-mt-10">
        <h2 className="sf-section-title">Top Brands</h2>
        <div className="sf-scroll-row">
          {[
            { title: "UP To 40% Off", desc: "Ace Your Base With Premium" },
            { title: "UP To 40% Off", desc: "Face Makeup That Fits Me" },
            { title: "UP To 25% Off", desc: "On Entire Range" },
            { title: "UP To 40% Off + Gifts", desc: "Worth ₹399 on Orders" },
            { title: "4 Exciting Gifts", desc: "Makeup For A Flawless Base" },
            { title: "Up To 25% Off", desc: "Wedding Superstars 2024" },
            { title: "Up To 50% Off", desc: "Worth ₹799 On ₹999" },
            { title: "On Rs. 3000: 3 Piece", desc: "On Rs. 5000: 4 Piece Kit" },
          ].map((item, i) => {
            const prod = getProduct(i + 9);
            return (
              <Link href={prod.link} className="sf-card" key={i}>
                <div className="sf-card-img"><img src={prod.image} alt="Brand" /></div>
                <div className="sf-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    

      {/* 4. PINK EXCLUSIVE SECTION */}
      <div className="sf-pink-section sf-mt-10">
        <h2 className="sf-section-title">Only At Our Boutique</h2>
        <div className="sf-grid-4">
          {[
            { title: "Flat 10% Off + Gifts", desc: "On Best Of Global Beauty" },
            { title: "Upto 30% off", desc: "Comfort Collection" },
            { title: "3 Exciting Gifts", desc: "The Ultimate Hydration Trio" },
            { title: "Upto 50% Off", desc: "Best Of Fragrances" },
          ].map((item, i) => {
            const prod = getProduct(i + 20);
            return (
              <Link href={prod.link} className="sf-card" key={i}>
                <div className="sf-card-img"><img src={prod.image} alt="Exclusive" /></div>
                <div className="sf-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 6. FEATURED BRANDS (SMALLER CARDS) */}
      <div className="sf-mt-10">
        <h2 className="sf-section-title">Featured Brands</h2>
        <div className="sf-scroll-row">
          {[
            { title: "Flat 10% off +", desc: "2 Gifts on ₹3000" },
            { title: "Min 20% Off", desc: "Serum of 799 on 799" },
            { title: "Upto 25% Off", desc: "On Entire Range" },
            { title: "Upto 35% Off", desc: "On Entire Range" },
            { title: "Upto 25% Off", desc: "Get Sunblock On ₹899" },
            { title: "Min 20% Off", desc: "Free Eyeliner on 699" },
            { title: "25% Off Combos", desc: "Haircare Bestsellers" },
          ].map((item, i) => {
            const prod = getProduct(i + 25);
            return (
              <Link href={prod.link} className="sf-card-small" key={i}>
                <div className="sf-card-img"><img src={prod.image} alt="Featured" /></div>
                <div className="sf-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      

      {/* 8. BRANDS YOU CANT MISS */}
      <div className="sf-mt-10">
        <h2 className="sf-section-title">Brands You Can't Miss</h2>
        <p className="sf-subtitle">Luxe Collection</p>
        
        <div className="sf-scroll-row sf-mt-4">
          {[0,1,2,3,4,5].map(i => {
            const prod = getProduct(i + 34);
            return (
              <Link href={prod.link} className="sf-card-mini" key={i}>
                <img src={prod.image} alt="Luxe" />
              </Link>
            );
          })}
        </div>

        <h2 className="sf-section-title sf-mt-10">Skincare Essentials</h2>
        <div className="sf-grid-4 sf-mt-4">
          {[
            { title: "Up To 20% off", desc: "Free Lotion on ₹1299" },
            { title: "Dry Oil For", desc: "Face, Body And Hair" },
            { title: "Sheet Masks", desc: "For A Radiant Glow" },
            { title: "Up To 53% off", desc: "On Bestsellers & Combos" }
          ].map((item, i) => {
            const prod = getProduct(i + 40);
            return (
              <Link href={prod.link} className="sf-card-small" key={i}>
                <div className="sf-card-img"><img src={prod.image} alt="Skin" /></div>
                <div className="sf-card-body">
                  <h3>{item.title}</h3><p>{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* RESPONSIVE CSS STYLES */}
      <style>{`
        /* Container - Full Width edge-to-edge */
        .sf-container {
          width: 100%;
          padding: 16px 24px;
          box-sizing: border-box;
          font-family: inherit;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .sf-container { padding: 32px 24px; }
        }

        /* Basic blocks */
        .sf-block {
          display: block;
          transition: transform 0.2s ease;
        }
        .sf-block:hover {
          transform: scale(0.99);
        }

        /* Typography */
        .sf-section-title {
          font-size: clamp(20px, 4vw, 32px);
          font-weight: 800;
          color: #111;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }
        .sf-subtitle {
          font-size: clamp(14px, 2vw, 16px);
          color: #666;
          margin: 0;
        }

        /* Spacing */
        .sf-mt-4 { margin-top: 16px; }
        .sf-mt-8 { margin-top: 32px; }
        .sf-mt-10 { margin-top: 48px; }

        /* Images */
        .sf-img-rounded {
          width: 100%;
          border-radius: 12px;
          object-fit: cover;
          display: block;
        }

        /* NEW: Categories in Focus - smaller image control */
        .sf-focus-card img {
          height: clamp(150px, 25vw, 250px); /* Keeps the images nicely sized, not massive */
        }

        /* SCROLLABLE ROWS WITH VISIBLE SCROLLBAR & GAPS */
        .sf-scroll-row {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 24px; /* Increased gap between products */
          padding-bottom: 16px; /* Space for scrollbar */
          padding-top: 12px;
          
          /* Firefox Scrollbar styling */
          scrollbar-width: thin;
          scrollbar-color: #cccccc #f5f5f5;
        }

        /* Webkit Custom Scrollbar (Chrome, Safari, Edge) */
        .sf-scroll-row::-webkit-scrollbar { 
          height: 8px; /* Thickness of scrollbar */
        }
        .sf-scroll-row::-webkit-scrollbar-track {
          background: #f5f5f5; 
          border-radius: 10px;
        }
        .sf-scroll-row::-webkit-scrollbar-thumb {
          background: #cccccc; 
          border-radius: 10px;
        }
        .sf-scroll-row::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8; /* Darker on hover */
        }
        
        /* Grids */
        .sf-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .sf-grid-2 { grid-template-columns: repeat(2, 1fr); }
        }

        .sf-grid-4 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 768px) {
          .sf-grid-4 { gap: 24px; }
        }
        @media (min-width: 1024px) {
          .sf-grid-4 { grid-template-columns: repeat(4, 1fr); }
        }

        /* Cards */
        .sf-card, .sf-card-small {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .sf-card:hover, .sf-card-small:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        /* Sizing inside scroll rows */
        .sf-scroll-row .sf-card { flex: 0 0 80%; scroll-snap-align: start; }
        .sf-scroll-row .sf-card-small { flex: 0 0 60%; scroll-snap-align: start; }
        
        @media (min-width: 640px) {
          .sf-scroll-row .sf-card { flex: 0 0 45%; }
          .sf-scroll-row .sf-card-small { flex: 0 0 35%; }
        }
        @media (min-width: 1024px) {
          .sf-scroll-row .sf-card { flex: 0 0 280px; } /* Fixed uniform width on desktop */
          .sf-scroll-row .sf-card-small { flex: 0 0 220px; }
        }

        .sf-card-img {
          width: 100%;
          aspect-ratio: 4 / 3;
        }
        .sf-card-img img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .sf-card-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
        }
        .sf-card-body h3 {
          font-size: clamp(14px, 2vw, 18px);
          font-weight: 700;
          color: #111;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sf-card-body p {
          font-size: clamp(12px, 1.5vw, 14px);
          color: #666;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mini Cards */
        .sf-card-mini {
          flex: 0 0 40%;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          scroll-snap-align: start;
          display: block;
          transition: transform 0.2s ease;
        }
        .sf-card-mini:hover {
          transform: scale(0.97);
        }
        .sf-card-mini img {
          width: 100%; height: 100%; object-fit: cover;
        }
        @media (min-width: 768px) {
          .sf-card-mini { flex: 0 0 200px; }
        }

        /* Banner Cards */
        .sf-banner-card {
          flex: 0 0 85%;
          scroll-snap-align: start;
          border-radius: 12px;
          overflow: hidden;
          display: block;
          transition: transform 0.2s ease;
        }
        .sf-banner-card:hover {
          transform: scale(0.98);
        }
        .sf-banner-card img {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
        }
        @media (min-width: 768px) {
          .sf-banner-card { flex: 0 0 400px; }
        }

        /* Pink Section */
        .sf-pink-section {
          background-color: #FFF0F5;
          padding: 32px 16px;
          border-radius: 16px;
        }
        @media (min-width: 768px) {
          .sf-pink-section { padding: 48px 32px; border-radius: 24px; }
        }
      `}</style>
    </div>
  );
}