"use client";
import { Truck, RotateCcw, ShieldCheck, Headphones, Sparkles } from "lucide-react";

const features = [
  { icon: Truck, title: "Complimentary Delivery", desc: "Free express shipping on all orders over ₹999" },
  { icon: RotateCcw, title: "30-Day Luxury Returns", desc: "Effortless return process with zero restocking fees" },
  { icon: ShieldCheck, title: "100% Authentic Guaranteed", desc: "Sourced directly from authorized luxury brands" },
  { icon: Headphones, title: "Dedicated Beauty Advisors", desc: "24/7 personalized skincare and fragrance assistance" },
];

export default function FeatureStrip() {
  return (
    <section style={{ width: "100%", padding: "0 clamp(16px, 3vw, 32px) 32px", overflow: "hidden" }}>
      <div
        className="features-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          width: "100%",
        }}
      >
       
      </div>

      <style>{`
        /* Staggered Entry Animation on Load */
        @keyframes fadeUpBounce {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          60% {
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animated-entry {
          opacity: 0;
          animation: fadeUpBounce 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Base Card Transitions */
        .feature-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
          cursor: pointer;
        }

        .card-glow-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #E8437F, #FF6B9D, #FFD700);
          background-size: 200% auto;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        /* Dynamic Hover Animations */
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(232, 67, 127, 0.08);
          border-color: rgba(232, 67, 127, 0.15);
        }

        .feature-card:hover .card-glow-line {
          transform: scaleX(1);
          animation: gradientShift 3s linear infinite;
        }

        .feature-card:hover .icon-wrapper {
          background: linear-gradient(135deg, #E8437F 0%, #FF6B9D 100%);
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 10px 20px rgba(232, 67, 127, 0.25);
        }

        .feature-card:hover .feature-icon {
          color: #ffffff !important;
          transform: scale(0.9);
        }

        .feature-card:hover .title-sparkle {
          opacity: 1 !important;
          transform: scale(1) !important;
        }

        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .feature-card {
            padding: 24px;
            gap: 16px;
          }
          .icon-wrapper {
            width: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}