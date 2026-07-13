"use client";
import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  Phone,
  Truck,
  RefreshCw,
  CheckCircle,
  Award
} from "lucide-react";
import { 
  FaInstagram, 
  FaFacebookF, 
  FaTwitter, 
  FaYoutube, 
  FaPinterestP 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      
      {/* 1. TOP BAND - Dark Slate */}
      <div className="footer-top-band">
        <div className="footer-top-grid">
          
          {/* Column 1: Brand */}
          <div className="footer-col">
            <h4 className="brand-title">GLAMOUR</h4>
            <div className="footer-links-col">
              <p className="brand-desc">
                Your destination for prestige beauty. Discover luxury skincare, makeup rituals, and haute perfumery from the world&apos;s most iconic houses.
              </p>
            </div>
          </div>

          {/* Column 2: Prestige Shop */}
          <div className="footer-col">
            <h4 className="col-title">Prestige Shop</h4>
            <div className="footer-links-col">
              {["Skincare Rituals", "Luxury Makeup", "Haute Fragrance", "Botanical Haircare", "Bath & Body", "VIP Gift Sets"].map((item) => (
                <Link key={item} href="#" className="footer-link-dark">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Client Care */}
          <div className="footer-col">
            <h4 className="col-title">Client Care</h4>
            <div className="footer-links-col">
              {["Contact Beauty Advisor", "Complimentary Returns", "Order Tracking & Delivery", "VIP Beauty FAQs", "Authenticity Guarantee", "Terms of Ritual"].map((item) => (
                <Link key={item} href="#" className="footer-link-dark">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Boutique */}
          <div className="footer-col">
            <h4 className="col-title">Flagship Boutique</h4>
            <div className="footer-links-col contact-col">
              <div className="contact-item">
                <MapPin size={18} color="#ffffff" className="contact-icon" />
                <span>128 Regent Street, Mayfair, London, W1B 5SE, UK</span>
              </div>
              <div className="contact-item">
                <Mail size={18} color="#ffffff" className="contact-icon" />
                <span>concierge@glamourbeauty.com</span>
              </div>
              <div className="contact-item">
                <Phone size={18} color="#ffffff" className="contact-icon" />
                <span>+44 (0) 20 7946 0128</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MIDDLE BAND - Off White Trust Badges */}
      <div className="footer-middle-band">
        <div className="footer-middle-container">
          
          {/* Trust Badges */}
          <div className="trust-badges-wrapper">
            
            <div className="trust-badge">
              <div className="pink-circle"><Truck size={20} color="#ffffff" /></div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">COMPLIMENTARY SHIPPING</div>
                <div className="trust-badge-sub">On Prestige Orders</div>
              </div>
            </div>

            <div className="trust-badge">
              <div className="pink-circle"><RefreshCw size={20} color="#ffffff" /></div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">EASY RETURNS</div>
                <div className="trust-badge-sub">15-Day Return Policy</div>
              </div>
            </div>

            <div className="trust-badge">
              <div className="pink-circle"><CheckCircle size={20} color="#ffffff" /></div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">100% AUTHENTIC</div>
                <div className="trust-badge-sub">Products Sourced Directly</div>
              </div>
            </div>

            <div className="trust-badge">
              <div className="pink-circle"><Award size={20} color="#ffffff" /></div>
              <div className="trust-badge-text">
                <div className="trust-badge-title">LUXURY BRANDS</div>
                <div className="trust-badge-sub">World&apos;s Best Houses</div>
              </div>
            </div>

          </div>

          {/* Social Icons */}
          <div className="social-section">
            <span className="social-title">Show us some love on social media</span>
            <div className="social-icons-wrapper">
              {[FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaPinterestP].map((Icon, idx) => (
                <a key={idx} href="#" className="black-social-icon">
                  <Icon size={14} color="#ffffff" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAND - Hot Pink */}
      <div className="footer-bottom-band">
        <div className="footer-bottom-links">
          {["Terms & Condition", "Shipping Policy", "Cancellation Policy", "Privacy Policy"].map((item) => (
            <Link key={item} href="#" className="pink-footer-link">
              {item}
            </Link>
          ))}
        </div>
        <p className="footer-copyright">
          © 2026 GLAMOUR Beauty Ltd. All prestige rights reserved.
        </p>
      </div>

      {/* Responsive Styles */}
      <style>{`
        /* --- General Layout --- */
        .footer-wrapper {
          width: 100%;
          font-family: sans-serif;
        }

        /* --- 1. Top Band --- */
        .footer-top-band {
          background: #3f414d;
          color: #ffffff;
          padding: 60px 5vw;
        }
        .footer-top-grid {
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        .brand-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          font-style: italic;
          letter-spacing: 1px;
        }
        .col-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .brand-desc {
          font-size: 14px;
          color: #d2d6db;
          line-height: 1.6;
          margin: 0;
        }
        .footer-link-dark {
          font-size: 14px;
          color: #d2d6db;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link-dark:hover {
          color: #fc2779;
        }
        .contact-col {
          gap: 16px;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #d2d6db;
          font-size: 14px;
          line-height: 1.5;
        }
        .contact-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* --- 2. Middle Band --- */
        .footer-middle-band {
          background: #f3f4f5;
          padding: 30px 5vw;
        }
        .footer-middle-container {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 40px;
        }
        .trust-badges-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          flex: 1;
        }
        .trust-badge {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pink-circle {
          width: 44px;
          height: 44px;
          background-color: #fc2779;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .trust-badge-title {
          font-size: 14px;
          font-weight: 600;
          color: #3f414d;
        }
        .trust-badge-sub {
          font-size: 12px;
          color: #8a8d93;
          margin-top: 2px;
        }
        .social-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .social-title {
          font-size: 14px;
          color: #3f414d;
          font-weight: 500;
        }
        .social-icons-wrapper {
          display: flex;
          gap: 10px;
        }
        .black-social-icon {
          width: 32px;
          height: 32px;
          background-color: #111111;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .black-social-icon:hover {
          background-color: #fc2779;
        }

        /* --- 3. Bottom Band --- */
        .footer-bottom-band {
          background: #fc2779;
          color: #ffffff;
          padding: 24px 20px;
          text-align: center;
        }
        .footer-bottom-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
        }
        .pink-footer-link {
          font-size: 13px;
          color: #ffffff;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .pink-footer-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        .footer-copyright {
          font-size: 13px;
          color: rgba(255,255,255,0.9);
          margin: 0;
        }

        /* =========================================
           MEDIA QUERIES FOR RESPONSIVENESS
           ========================================= */

        /* TABLET & SMALL LAPTOPS (Max 1024px) */
        @media (max-width: 1024px) {
          .footer-top-grid {
            grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
            gap: 40px 30px;
          }
          .footer-middle-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .social-section {
            width: 100%;
            border-top: 1px solid #e2e4e8;
            padding-top: 20px;
          }
        }

        /* MOBILE DEVICES (Max 768px) */
        @media (max-width: 768px) {
          .footer-top-band {
            padding: 40px 5vw;
          }
          .footer-top-grid {
            grid-template-columns: 1fr; /* 1 column on mobile */
            gap: 30px;
          }
          .trust-badges-wrapper {
            display: grid;
            grid-template-columns: repeat(2, 1fr); /* 2x2 grid for badges on mobile */
            gap: 20px;
            width: 100%;
          }
          .trust-badge {
            flex-direction: column;
            text-align: center;
            align-items: center;
            gap: 8px;
          }
          .social-section {
            align-items: center;
            text-align: center;
          }
          .footer-bottom-links {
            gap: 12px 20px;
            line-height: 1.8;
          }
        }

        /* EXTRA SMALL MOBILE (Max 480px) */
        @media (max-width: 480px) {
          .trust-badges-wrapper {
            grid-template-columns: 1fr; /* Stack badges 1 by 1 on very small screens */
          }
          .trust-badge {
            flex-direction: row;
            text-align: left;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
}