"use client";
import React, { useEffect, useState, useCallback } from "react";

import { useToastContext } from "@/contexts/toastContext";
import { getSchedule } from "@/utils/apiClient";

import LandingHeaderSection from "./LandingHeaderSection";
import LandingHeroSection from "./LandingHeroSection";
import LandingSalesAndMarketingSection from "./LandingSalesAndMarketingSection";
import LandingSummarySection from "./LandingSummarySection";
import LandingBusinessSection from "./LandingBusinessSection";
import LandingCreditSection from "./LandingCreditSection";
import LandingNewsSection from "./LandingNewsSection";
import LandingFooterSection from "./LandingFooterSection";
import LandingScheduleSection from "./LandingScheduleSection";
import LandingCompanySection from "./LandingCompanySection";

interface FormData {
  name: string;
  company: string;
  email: string;
}

const LandingPageSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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
    setIsScrolled(currentScrollY > 0);
  }, []);

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
    try {
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
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

  return (
    <div className="relative w-full text-black min-h-screen overflow-x-hidden bg-transparent">
      <BackgroundPattern />
      <div className="relative z-10">
        <LandingHeaderSection
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          scrollToSection={scrollToSection}
          isLandingPage={true}
          headerBackground=""
          isScrolled={isScrolled}
        />

        <main className="pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
          {" "}
          {/* Changed mt- to pt- */}
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
      </svg>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-gray-300 opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-transparent to-gray-200 opacity-40"></div>

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-gray-100 to-transparent opacity-25"></div>
    </div>
  );
};

export default LandingPageSection;
