"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, ShoppingBag, Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/context/CategoriesContext";

// Import the logo directly using a relative path from src/components/layout/Header.jsx
import logoImg from "../../../assets/1000068521.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { categories } = useCategories(); 
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef(null);

  // Dynamically fetch top-level categories from your API context
  const mainNavCategories = categories?.filter(c => c.parent === 0 && c.count > 0).slice(0, 9) || [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className={`beauty-header ${scrolled ? "scrolled" : ""}`}>
        {/* Soft Elegance Promo Bar */}
        <div className="promo-bar">
          <Sparkles size={14} className="promo-icon" />
          <p>
            Complimentary samples on orders over ₹1500 <span className="divider">|</span> Use code <strong>BEAUTY20</strong> for 20% off
          </p>
        </div>

        {/* Top Section: Logo, Navigation, and Icons */}
        <div className="header-main">
          {/* Mobile Toggle */}
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.2} />
          </button>

          {/* 1. Logo */}
          <Link href="/" className="logo-link">
            <img 
              // Using logoImg.src handles Next.js image imports, fallback to logoImg just in case
              src={logoImg?.src || logoImg} 
              alt="Brand Logo" 
              className="brand-logo" 
            />
          </Link>

          {/* 2. Desktop Category Navigation (Centered between logo and icons) */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {mainNavCategories.map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/productpage/products?category=${cat.id}`}
                    className="nav-link"
                  >
                    <span dangerouslySetInnerHTML={{ __html: cat.name }} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Right Action Icons */}
          <div className="actions-container">
            {/* User Dropdown */}
            <div className="user-menu-wrapper" ref={userRef}>
              <button 
                className="action-icon" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Account"
              >
                <User size={22} strokeWidth={1.2} />
                <span className="action-label">{user ? user.first_name || 'Profile' : 'Sign In'}</span>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-card">
                  {user ? (
                    <>
                      <div className="user-info">
                        <p className="greeting">Welcome back, {user.first_name || 'Beautiful'}</p>
                        <p className="email">{user.email}</p>
                      </div>
                      <div className="user-links">
                        <Link href="/account/orders" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                        <Link href="/account/wishlist" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                      </div>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="logout-btn">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="guest-actions">
                      <p>Sign in to track orders and save your favorites.</p>
                      <Link href="/auth" className="primary-btn" onClick={() => setUserMenuOpen(false)}>
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className="action-icon cart-trigger">
              <div className="cart-icon-wrapper">
                <ShoppingBag size={22} strokeWidth={1.2} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="action-label">Bag</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <img 
            src={logoImg?.src || logoImg} 
            alt="Brand Logo" 
            className="brand-logo-mobile" 
          />
          <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} strokeWidth={1.2} />
          </button>
        </div>

        <div className="sidebar-content">
          {!user && (
            <div className="sidebar-auth">
              <Link href="/auth" className="primary-btn outline" onClick={() => setMobileMenuOpen(false)}>
                Login to your account
              </Link>
            </div>
          )}

          <h3 className="sidebar-title">Shop by Category</h3>
          <ul className="sidebar-nav">
            {mainNavCategories.map((cat) => (
              <li key={cat.id}>
                <Link 
                  href={`/productpage/products?category=${cat.id}`}
                  className="sidebar-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span dangerouslySetInnerHTML={{ __html: cat.name }} />
                  <ChevronRight size={16} className="chevron" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --brand-pink: #D5418E;
          --brand-pink-light: #fdf2f7;
          --brand-dark: #121212;
          --brand-gray: #f5f5f5;
          --text-main: #222222;
          --text-muted: #757575;
          --border-color: #eaeaea;
        }

        /* --- HEADER BASE --- */
        .beauty-header {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 1000;
          background-color: #ffffff;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-bottom: 1px solid transparent;
        }
        
        .beauty-header.scrolled {
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          border-bottom: 1px solid var(--border-color);
        }

        /* --- PROMO BAR --- */
        .promo-bar {
          background-color: var(--brand-pink-light);
          color: var(--brand-pink);
          font-size: 12px;
          font-weight: 500;
          text-align: center;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.5px;
        }
        .promo-icon { color: var(--brand-pink); }
        .divider { margin: 0 8px; opacity: 0.3; }

        /* --- MAIN TIER --- */
        .header-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          max-width: 1440px;
          margin: 0 auto;
          gap: 24px;
        }

        .mobile-toggle {
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          display: none;
          padding: 4px;
        }

        /* --- LOGO --- */
        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        
        .brand-logo {
          height: 40px; /* Adjust height if the image is too big/small */
          width: auto;
          object-fit: contain;
        }

        .brand-logo-mobile {
          height: 32px; /* Smaller size for mobile sidebar */
          width: auto;
          object-fit: contain;
        }

        /* --- CATEGORIES DESKTOP NAV (INLINE) --- */
        .desktop-nav {
          flex: 1; /* Takes up middle space */
          display: flex;
          justify-content: center;
        }
        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .nav-link {
          display: block;
          padding: 8px 0;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-main);
          text-decoration: none;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link:hover { color: var(--brand-pink); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--brand-pink);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::after { width: 100%; }

        /* --- ICONS & USER ACTIONS --- */
        .actions-container {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .action-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--text-main);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .action-icon:hover { color: var(--brand-pink); }
        .action-label {
          font-size: 12px;
          font-weight: 500;
        }
        .cart-icon-wrapper { position: relative; }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: var(--brand-pink);
          color: #fff;
          font-size: 10px;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #fff;
        }

        /* --- USER DROPDOWN --- */
        .user-menu-wrapper { position: relative; }
        .user-dropdown-card {
          position: absolute;
          top: calc(100% + 12px);
          right: -10px;
          width: 260px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.12);
          border: 1px solid var(--border-color);
          overflow: hidden;
          z-index: 100;
        }
        .user-info {
          padding: 20px;
          background: #fafafa;
          border-bottom: 1px solid var(--border-color);
        }
        .greeting { font-size: 15px; font-weight: 600; color: var(--text-main); margin: 0 0 4px 0; }
        .email { font-size: 13px; color: var(--text-muted); margin: 0; }
        
        .user-links {
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }
        .user-links a {
          padding: 12px 20px;
          color: var(--text-main);
          text-decoration: none;
          font-size: 14px;
          transition: background 0.2s;
        }
        .user-links a:hover { background: var(--brand-pink-light); color: var(--brand-pink); }
        
        .logout-btn {
          width: 100%;
          text-align: left;
          padding: 16px 20px;
          background: none;
          border: none;
          border-top: 1px solid var(--border-color);
          color: var(--text-muted);
          font-size: 14px;
          cursor: pointer;
        }
        .logout-btn:hover { color: var(--brand-dark); background: #fafafa; }
        
        .guest-actions { padding: 24px 20px; text-align: center; }
        .guest-actions p { font-size: 13px; color: var(--text-muted); margin: 0 0 16px 0; line-height: 1.5; }
        .primary-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background: var(--brand-pink);
          color: #fff;
          text-align: center;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          transition: background 0.2s;
        }
        .primary-btn:hover { background: #b83679; }
        .primary-btn.outline {
          background: transparent;
          color: var(--brand-pink);
          border: 1px solid var(--brand-pink);
        }
        .primary-btn.outline:hover { background: var(--brand-pink-light); }

        /* --- MOBILE SIDEBAR --- */
        .mobile-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          z-index: 10001;
        }
        .mobile-overlay.active { opacity: 1; pointer-events: auto; }

        .mobile-sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 85%;
          max-width: 340px;
          background: #fff;
          z-index: 10002;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
        }
        .mobile-sidebar.active { transform: translateX(0); }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        .sidebar-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }
        .sidebar-auth { margin-bottom: 32px; }
        
        .sidebar-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin: 0 0 16px 0;
        }
        .sidebar-nav { list-style: none; padding: 0; margin: 0; }
        .sidebar-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          color: var(--text-main);
          text-decoration: none;
          font-size: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        .sidebar-link .chevron { color: #ccc; transition: transform 0.2s; }
        .sidebar-link:hover .chevron { transform: translateX(4px); color: var(--brand-pink); }

        /* --- RESPONSIVE MEDIA QUERIES --- */
        @media (max-width: 1024px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
          .header-main { padding: 16px; gap: 16px; }
          .logo-link { margin-right: auto; margin-left: 12px; }
          .action-label { display: none; } /* Hide labels on mobile to save space */
          .actions-container { gap: 16px; }
        }
      `}</style>
    </>
  );
}