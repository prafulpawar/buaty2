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
    <footer style={{ width: "100%", fontFamily: "sans-serif" }}>
      
      {/* 1. TOP BAND - Dark Slate (Exact Nykaa Style) */}
      <div style={{ background: "#3f414d", color: "#ffffff", padding: "60px 5vw" }}>
        <div 
          style={{ 
            maxWidth: "1440px", 
            margin: "0 auto", 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
            gap: "40px" 
          }}
        >
          
          {/* Column 1: Brand */}
          <div>
            <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", fontStyle: "italic", letterSpacing: "1px" }}>
              GLAMOUR
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "14px", color: "#d2d6db", lineHeight: "1.6" }}>
                Your destination for prestige beauty. Discover luxury skincare, makeup rituals, and haute perfumery from the world&apos;s most iconic houses.
              </p>
            </div>
          </div>

          {/* Column 2: Prestige Shop */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Prestige Shop</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Skincare Rituals", "Luxury Makeup", "Haute Fragrance", "Botanical Haircare", "Bath & Body", "VIP Gift Sets"].map((item) => (
                <Link key={item} href="/category/all" className="footer-link-dark">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Client Care */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Client Care</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Contact Beauty Advisor", "Complimentary Returns", "Order Tracking & Delivery", "VIP Beauty FAQs", "Authenticity Guarantee", "Terms of Ritual"].map((item) => (
                <Link key={item} href="#" className="footer-link-dark">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact & Boutique */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px" }}>Flagship Boutique</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", color: "#d2d6db", fontSize: "14px", lineHeight: "1.5" }}>
                <MapPin size={18} color="#ffffff" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>128 Regent Street, Mayfair, London, W1B 5SE, UK</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#d2d6db", fontSize: "14px" }}>
                <Mail size={18} color="#ffffff" style={{ flexShrink: 0 }} />
                <span>concierge@glamourbeauty.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#d2d6db", fontSize: "14px" }}>
                <Phone size={18} color="#ffffff" style={{ flexShrink: 0 }} />
                <span>+44 (0) 20 7946 0128</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MIDDLE BAND - Off White Trust Badges (Exact Nykaa Style) */}
      <div style={{ background: "#f3f4f5", padding: "30px 5vw" }}>
        <div 
          style={{ 
            maxWidth: "1440px", 
            margin: "0 auto", 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "30px"
          }}
        >
          {/* Trust Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
            
            <div className="trust-badge">
              <div className="pink-circle"><Truck size={20} color="#ffffff" /></div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#3f414d" }}>COMPLIMENTARY SHIPPING</div>
                <div style={{ fontSize: "12px", color: "#8a8d93", marginTop: "2px" }}>On Prestige Orders</div>
              </div>
            </div>

            <div className="trust-badge">
              <div className="pink-circle"><RefreshCw size={20} color="#ffffff" /></div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#3f414d" }}>EASY RETURNS</div>
                <div style={{ fontSize: "12px", color: "#8a8d93", marginTop: "2px" }}>15-Day Return Policy</div>
              </div>
            </div>

            <div className="trust-badge">
              <div className="pink-circle"><CheckCircle size={20} color="#ffffff" /></div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#3f414d" }}>100% AUTHENTIC</div>
                <div style={{ fontSize: "12px", color: "#8a8d93", marginTop: "2px" }}>Products Sourced Directly</div>
              </div>
            </div>

            <div className="trust-badge">
              <div className="pink-circle"><Award size={20} color="#ffffff" /></div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#3f414d" }}>LUXURY BRANDS</div>
                <div style={{ fontSize: "12px", color: "#8a8d93", marginTop: "2px" }}>World&apos;s Best Houses</div>
              </div>
            </div>

          </div>

          {/* Social Icons mapped securely using react-icons */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ fontSize: "14px", color: "#3f414d", fontWeight: "500" }}>Show us some love on social media</span>
            <div style={{ display: "flex", gap: "10px" }}>
              {[FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaPinterestP].map((Icon, idx) => (
                <a key={idx} href="#" className="black-social-icon">
                  <Icon size={14} color="#ffffff" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAND - Hot Pink (Exact Nykaa Style) */}
      <div style={{ background: "#fc2779", color: "#ffffff", padding: "24px 20px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", marginBottom: "12px" }}>
          {["Terms & Condition", "Shipping Policy", "Cancellation Policy", "Privacy Policy"].map((item) => (
            <Link key={item} href="#" className="pink-footer-link">
              {item}
            </Link>
          ))}
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", margin: 0 }}>
          © 2026 GLAMOUR Beauty Ltd. All prestige rights reserved.
        </p>
      </div>

      {/* Styles */}
      <style>{`
        /* Links in the dark gray section */
        .footer-link-dark {
          font-size: 14px;
          color: #d2d6db;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link-dark:hover {
          color: #fc2779;
        }

        /* Links in the hot pink section */
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

        /* Trust Badges in the light gray section */
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
        }

        /* Black Social Icons matching screenshot */
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
      `}</style>
    </footer>
  );
}