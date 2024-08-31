"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useToastContext } from "@/contexts/toastContext";
import { getSchedule } from "@/utils/apiClient";
import LandingHeaderSection from "./Header";
import LandingHeroSection from "./HeroSection";
import LandingSalesAndMarketingSection from "./SalesAndMarketingSection";
import LandingSummarySection from "./SummarySection";
import LandingBusinessSection from "./BusinessSection";
import LandingCreditSection from "./CreditSection";
import LandingNewsSection from "./NewsSection";
import LandingFooterSection from "./Footer";
import LandingScheduleSection from "./Schedule";
import LandingCompanySection from "./LandingCompanySection";

interface FormData {
  name: string;
  company: string;
  email: string;
}

const LandingPage: React.FC = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const salesAndMarketingSectionRef = useRef<HTMLElement>(null);
  const featureSectionRef = useRef<HTMLElement>(null);
  const pricingSectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
  });

  const [blogs, setBlogs] = useState([]);

  const { invokeToast } = useToastContext();

  const handleSchedule = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await getSchedule(formData);
      invokeToast("success", "Your demo has been scheduled successfully!");
      setFormData({ name: "", company: "", email: "" });
    } catch (error) {
      console.error("Error scheduling demo:", error);
      invokeToast(
        "error",
        "There was an issue scheduling your demo. Please try again later."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsHeaderVisible(currentScrollY <= lastScrollY);
    setLastScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 0);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const scrollToSection = (sectionId: string): void => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getBlogData = async () => {
    const strapiUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const res = await fetch(`${strapiUrl}/api/blogs?populate=*`);
    const posts = await res.json();
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.warn(
        "STRAPI_URL is not defined in the environment variables. Using default: http://localhost:1337"
      );
    }
    setBlogs(posts.data);
  };

  useEffect(() => {
    getBlogData();
  }, []);

  return (
    <div className="relative w-full text-black min-h-screen overflow-x-hidden bg-transparent">
      <BackgroundPattern />
      <div className="relative z-10">
        <LandingHeaderSection
          isHeaderVisible={isHeaderVisible}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          scrollToSection={scrollToSection}
          isLandingPage={true}
        />

        <main className="mt-10 sm:mt-15 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <LandingHeroSection />
            <div className="hidden md:block">
              <LandingCompanySection />
            </div>
            <LandingSalesAndMarketingSection />
            <LandingSummarySection />
            <LandingBusinessSection />
            <LandingCreditSection />
            <LandingNewsSection blogs={blogs} />
            <LandingScheduleSection
              handleChange={handleChange}
              handleSchedule={handleSchedule}
              formData={formData}
            />
            <LandingFooterSection scrollToSection={scrollToSection} />
          </div>
        </main>
      </div>
    </div>
  );
};

const BackgroundPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
        </defs>

        <rect width="100%" height="100%" fill="url(#grad1)" />

        {/* Large subtle gray circles */}
        <circle cx="200" cy="200" r="300" fill="#9ca3af" opacity="0.07" />
        <circle cx="800" cy="800" r="400" fill="#6b7280" opacity="0.05" />

        {/* Small shapes - hidden on mobile */}
        <g className="hidden md:block">
          <circle cx="50" cy="100" r="80" fill="#9ca3af" opacity="0.25" />
          <polygon
            points="600,150 625,175 575,175"
            fill="#9ca3af"
            opacity="0.15"
          />{" "}
          {/* Moved lower */}
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
          </circle>
        </g>

        {/* Pulsating hexagon - hidden on mobile */}
        <g className="hidden md:block">
          <polygon
            points="850,550 925,625 925,775 850,850 775,775 775,625"
            fill="none"
            stroke="#4b5563"
            strokeWidth="2"
            opacity="0.2"
          >
            {" "}
            {/* Reduced stroke width and opacity */}
            <animate
              attributeName="opacity"
              values="0.2;0.4;0.2"
              dur="5s"
              repeatCount="indefinite"
            />{" "}
            {/* Adjusted opacity animation */}
          </polygon>
        </g>

        {/* Rotating triangle - smaller and visible on all devices */}
        <g opacity="0.2">
          {" "}
          {/* Reduced opacity */}
          <polygon points="175,175 200,150 225,175" fill="#6b7280">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 200 175"
              to="360 200 175"
              dur="15s"
              repeatCount="indefinite"
            />
          </polygon>
        </g>
      </svg>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-gray-300 opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-transparent to-gray-200 opacity-40"></div>

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-gray-100 to-transparent opacity-25"></div>
    </div>
  );
};

export default LandingPage;
