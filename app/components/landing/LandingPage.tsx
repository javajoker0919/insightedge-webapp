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

interface FormData {
  name: string;
  company: string;
  email: string;
}

const LandingPage: React.FC = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const salesAndMarketingSectionRef = useRef<HTMLElement>(null);
  const featureSectionRef = useRef<HTMLElement>(null);
  const pricingSectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: ""
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
    <div className="w-full text-black bg-gradient-to-b">
      <LandingHeaderSection
        isHeaderVisible={isHeaderVisible}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        scrollToSection={scrollToSection}
      />

      <MainContent
        salesAndMarketingSectionRef={salesAndMarketingSectionRef}
        featureSectionRef={featureSectionRef}
        pricingSectionRef={pricingSectionRef}
        handleChange={handleChange}
        handleSchedule={handleSchedule}
        formData={formData}
        blogs={blogs}
        scrollToSection={scrollToSection}
      />
    </div>
  );
};

const MainContent: React.FC<{
  salesAndMarketingSectionRef: React.RefObject<HTMLElement>;
  featureSectionRef: React.RefObject<HTMLElement>;
  pricingSectionRef: React.RefObject<HTMLElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSchedule: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: { name: string; company: string; email: string };
  blogs: any;
  scrollToSection: (sectionId: string) => void;
}> = ({ handleChange, handleSchedule, formData, blogs, scrollToSection }) => (
  <main className="mt-16 sm:mt-16">
    <LandingHeroSection />
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
  </main>
);

export default LandingPage;
