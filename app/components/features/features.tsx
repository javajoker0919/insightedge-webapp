"use client";
import React, { useState, useEffect, useCallback } from "react";
import LandingHeaderSection from "../landing/LandingHeaderSection";
import FeatureHeroSection from "./FeatureHeroSection";
import FeatureSalesSection from "./FeatureSalesSection";
import FeatureMarketingSection from "./FeatureMarketingSection";
import FeatureBusinessSection from "./FeatureBusinessSection";
import FeatureFooterSection from "./FeatureFooterSection";

const FeaturesPage: React.FC = () => {
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
      {/* Existing background SVG and gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
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

          {/* Large subtle gray circles */}
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

          {/* Small shapes - hidden on mobile */}
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

          {/* Animated shapes - hidden on mobile */}
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

          {/* Glowing dots - reduced on mobile */}
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

          {/* New animated wave */}
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

          {/* New floating geometric shapes */}
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

          {/* Additional glowing dots */}
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

        {/* Updated gradient overlay to match LandingPage */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-gray-300 opacity-40"></div>

        {/* Radial gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-gray-100 to-transparent opacity-25"></div>
      </div>

      {/* Floating header with subtle background */}
      <LandingHeaderSection
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        scrollToSection={scrollToSection}
        isLandingPage={false}
        isTransparent={!isScrolled}
        isScrolled={isScrolled}
      />

      {/* Add padding to the top to account for the fixed header */}
      <div className="pt-20">
        <FeatureHeroSection />
        <FeatureSalesSection />
        <FeatureMarketingSection />
        <FeatureBusinessSection />
        <FeatureFooterSection />
      </div>
    </div>
  );
};

export default FeaturesPage;
