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
import LandingCompanySection from "./LandingComapnySection";

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

        <main className="mt-10 sm:mt-15">
          {" "}
          {/* Significantly reduced margin-top here */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LandingHeroSection />
            <LandingCompanySection />
            <LandingSalesAndMarketingSection />
            {/* <LandingSummarySection /> */}
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
    <div className="fixed inset-0 overflow-hidden">
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Subtle gradient background */}
        <rect width="100%" height="100%" fill="url(#grad1)" />

        {/* Abstract shapes */}
        <circle cx="50" cy="100" r="80" fill="#9ca3af" opacity="0.15" />

        {/* New design graphics */}
        <ellipse
          cx="200"
          cy="800"
          rx="100"
          ry="50"
          fill="#6b7280"
          opacity="0.1"
        />
        <polygon
          points="600,100 650,150 550,150"
          fill="#9ca3af"
          opacity="0.12"
        />

        {/* Floating dots */}
        <g>
          <circle cx="150" cy="300" r="6" fill="#6b7280" opacity="0.6">
            <animate
              attributeName="cy"
              values="300;285;300"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="750" cy="200" r="5" fill="#9ca3af" opacity="0.6">
            <animate
              attributeName="cy"
              values="200;215;200"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="550" cy="700" r="7" fill="#4b5563" opacity="0.6">
            <animate
              attributeName="cy"
              values="700;685;700"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="150" cy="500" r="5" fill="#9ca3af" opacity="0.6">
            <animate
              attributeName="cy"
              values="500;515;500"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Additional subtle graphics */}
        <path
          d="M0,0 Q500,200 1000,0"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.2"
        />
        <path
          d="M0,1000 Q500,800 1000,1000"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.2"
        />
        <circle
          cx="900"
          cy="100"
          r="50"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1"
          opacity="0.2"
        />
        <circle
          cx="100"
          cy="900"
          r="70"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* New wavy line */}
        <path
          d="M0,400 Q250,350 500,400 T1000,400"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>

      {/* Subtle gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gray-100 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-300 to-transparent"></div>
      <div className="absolute top-0 left-0 bottom-0 w-64 bg-gradient-to-r from-gray-200 to-transparent"></div>
      <div className="absolute top-0 right-0 bottom-0 w-64 bg-gradient-to-l from-gray-200 to-transparent"></div>

      {/* Diagonal gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-gray-100 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-gray-200 to-transparent opacity-50"></div>

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-gray-100 to-transparent opacity-30"></div>
    </div>
  );
};

export default LandingPage;
