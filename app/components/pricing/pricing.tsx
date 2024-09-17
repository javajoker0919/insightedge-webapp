"use client"; // Add this directive to make the component a client component

import React, { useState, useEffect, useCallback } from "react";
import Pricing from "./pricingsection";
import FAQ from "./faq";
import LandingHeaderSection from "../landing/LandingHeaderSection";
import LandingFooterSection from "../landing/LandingFooterSection";

const PricingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative w-full text-black min-h-screen overflow-x-hidden bg-transparent">
      <LandingHeaderSection
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        scrollToSection={scrollToSection}
        isLandingPage={false}
        isTransparent={!isScrolled}
        isScrolled={isScrolled}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.15" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
          <circle cx="200" cy="200" r="300" fill="#9ca3af" opacity="0.07">
            <animate
              attributeName="r"
              values="300;320;300"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="800" cy="800" r="400" fill="#6b7280" opacity="0.05">
            <animate
              attributeName="r"
              values="400;420;400"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>
          <g className="hidden md:block">
            <circle cx="50" cy="100" r="80" fill="#9ca3af" opacity="0.25">
              <animate
                attributeName="cy"
                values="100;120;100"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          <g className="hidden md:block">
            <circle cx="800" cy="200" r="40" fill="#4b5563" opacity="0.3">
              <animate
                attributeName="r"
                values="40;55;40"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values="800;820;800"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          <g filter="url(#glow)">
            <circle cx="300" cy="300" r="5" fill="#60a5fa" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="5;7;5"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          <path
            d="M0,100 Q250,50 500,100 T1000,100 V1000 H0 Z"
            fill="url(#grad2)"
          >
            <animate
              attributeName="d"
              values="M0,100 Q250,50 500,100 T1000,100 V1000 H0 Z;
                      M0,100 Q250,150 500,100 T1000,100 V1000 H0 Z;
                      M0,100 Q250,50 500,100 T1000,100 V1000 H0 Z"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
          <g className="hidden lg:block">
            <polygon
              points="850,80 870,120 830,120"
              fill="#60a5fa"
              opacity="0.3"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,20; 0,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </polygon>
            <rect
              x="100"
              y="600"
              width="40"
              height="40"
              fill="#3b82f6"
              opacity="0.2"
              transform="rotate(45 120 620)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="45 120 620; 90 120 620; 45 120 620"
                dur="6s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
          <g filter="url(#glow)">
            <circle cx="700" cy="500" r="4" fill="#93c5fd" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="4;6;4"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="150" cy="700" r="3" fill="#60a5fa" opacity="0.7">
              <animate
                attributeName="opacity"
                values="0.7;0.4;0.7"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="3;5;3"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-gray-300 opacity-0"></div>
        <div className="absolute inset-0 bg-radial-gradient from-gray-100 to-transparent opacity-0"></div>
      </div>
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-[#004AAD]">Compare our plans</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free or choose among our paid plans for more power
            </p>
          </div>
          <div className="relative z-10 pt-20">
            <h1 className="text-4xl font-bold text-center mb-8">
              Pricing Plans
            </h1>
            <Pricing />
          </div>
          <FAQ />
        </div>
      </section>
      <LandingFooterSection scrollToSection={scrollToSection} />
    </div>
  );
};

export default PricingPage;
