"use client";
import { useState, useRef } from "react";
import { Send, Sparkles, CheckCircle2 } from "lucide-react";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Magnetic button state
  const buttonRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  const handleMagneticMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    buttonRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
  };

  const handleMagneticLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0px, 0px) scale(1)";
  };

  return (
    <section style={{ width: "100%", padding: "0 clamp(16px, 3vw, 32px) 48px", overflow: "hidden" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "32px",
          background: "#0A0A0B", // Matches the new dark theme
          padding: "clamp(56px, 8vw, 80px) clamp(24px, 5vw, 64px)",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Animated Background Orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        
        {/* Noise overlay for premium texture */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "url('https://grainy-gradients.vercel.app/noise.svg')",
            opacity: 0.05,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "640px", margin: "0 auto" }}>
          
          {/* Staggered Content Block */}
          <div className="stagger-1">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(201, 169, 110, 0.1)",
                backdropFilter: "blur(12px)",
                padding: "8px 16px",
                borderRadius: "50px",
                border: "1px solid rgba(201, 169, 110, 0.2)",
                marginBottom: "24px",
              }}
            >
              <Sparkles size={14} color="#C9A96E" />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#C9A96E", letterSpacing: "2px", textTransform: "uppercase" }}>
                VIP Beauty Club
              </span>
            </div>
          </div>

          <h2 className="stagger-2" style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, color: "#ffffff", marginBottom: "16px", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
            Stay in the Glow
          </h2>
          
          <p className="stagger-3" style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", marginBottom: "40px", maxWidth: "540px", marginInline: "auto" }}>
            Subscribe to receive 15% off your first luxury ritual, plus VIP access to private product launches and expert skincare masterclasses.
          </p>

          {/* Form Area */}
          <div className="stagger-4" style={{ marginTop: "40px" }}>
            {submitted ? (
              <div 
                className="success-pop" 
                style={{ 
                  background: "rgba(255, 255, 255, 0.05)", 
                  backdropFilter: "blur(20px)", 
                  borderRadius: "24px", 
                  padding: "24px 32px", 
                  display: "inline-flex", 
                  alignItems: "center",
                  gap: "16px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                <div style={{ background: "#E8437F", borderRadius: "50%", padding: "4px" }}>
                  <CheckCircle2 size={24} color="#ffffff" />
                </div>
                <p style={{ color: "#ffffff", fontSize: "16px", fontWeight: 500, margin: 0 }}>
                  Welcome to the VIP Beauty Club! Your 15% off code is on its way.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                className={`form-wrapper ${isFocused ? 'form-focused' : ''}`}
                style={{ 
                  display: "flex", 
                  maxWidth: "500px", 
                  margin: "0 auto", 
                  gap: "8px", 
                  background: "rgba(255, 255, 255, 0.03)", 
                  backdropFilter: "blur(20px)", 
                  padding: "8px", 
                  borderRadius: "100px", 
                  border: "1px solid rgba(255, 255, 255, 0.1)", 
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  flexWrap: "wrap",
                  position: "relative"
                }}
              >
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  type="email"
                  placeholder="Enter your email address..."
                  required
                  className="newsletter-input"
                  style={{ 
                    flex: 1, 
                    padding: "16px 24px", 
                    border: "none", 
                    outline: "none", 
                    fontSize: "15px", 
                    background: "transparent", 
                    color: "#ffffff", 
                    minWidth: "200px" 
                  }}
                />
                <button
                  ref={buttonRef}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  type="submit"
                  className="submit-btn"
                  style={{
                    padding: "16px 32px",
                    background: "#E8437F",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "100px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform"
                  }}
                >
                  <span>Subscribe</span>
                  <Send size={16} className="send-icon" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* Floating Animated Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          z-index: 0;
          animation: float 10s infinite ease-in-out alternate;
        }
        .orb-1 {
          top: -20%;
          right: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(232,67,127,0.2) 0%, rgba(0,0,0,0) 70%);
          animation-delay: 0s;
        }
        .orb-2 {
          bottom: -30%;
          left: 0%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201,169,110,0.15) 0%, rgba(0,0,0,0) 70%);
          animation-delay: -5s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 40px) scale(1.1); }
        }

        /* Staggered Entrance Animations */
        .stagger-1 { animation: slideUpFade 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .stagger-2 { animation: slideUpFade 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .stagger-3 { animation: slideUpFade 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .stagger-4 { animation: slideUpFade 0.8s 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Form Interactions */
        .newsletter-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .form-wrapper:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .form-focused {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(232, 67, 127, 0.5) !important;
          box-shadow: 0 0 30px rgba(232, 67, 127, 0.15), inset 0 0 20px rgba(255,255,255,0.02) !important;
          transform: scale(1.02);
        }

        /* Button Hover */
        .submit-btn:hover {
          background: #ffffff !important;
          color: #E8437F !important;
          box-shadow: 0 10px 25px rgba(232, 67, 127, 0.3);
        }
        .submit-btn:hover .send-icon {
          transform: translateX(4px) translateY(-4px);
        }

        /* Success Animation */
        .success-pop {
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 640px) {
          .submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}