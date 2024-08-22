"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useAtomValue } from "jotai";

import { FaClock, FaRecycle, FaBookReader } from "react-icons/fa";
import { FaPuzzlePiece } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { MdOutlineToken } from "react-icons/md";
import { IoTelescope } from "react-icons/io5";

import { userMetadataAtom } from "@/utils/atoms";
import { Logo } from "../components";
import Link from "next/link";

interface HeaderProps {
  isHeaderVisible: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  scrollToSection: (sectionId: string) => void;
}

const LandingPage: React.FC = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const salesAndMarketingSectionRef = useRef<HTMLElement>(null);
  const featureSectionRef = useRef<HTMLElement>(null);
  const pricingSectionRef = useRef<HTMLElement>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsHeaderVisible(currentScrollY <= lastScrollY);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full text-black bg-gradient-to-b">
      <Header
        isHeaderVisible={isHeaderVisible}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        scrollToSection={scrollToSection}
      />
      <MainContent
        salesAndMarketingSectionRef={salesAndMarketingSectionRef}
        featureSectionRef={featureSectionRef}
        pricingSectionRef={pricingSectionRef}
      />
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  isHeaderVisible,
  isMenuOpen,
  toggleMenu,
  scrollToSection,
}) => (
  <header
    className={`py-4 fixed top-0 left-0 right-0 bg-white z-10 shadow-md transition-transform duration-300 ${
      isHeaderVisible ? "translate-y-0" : "-translate-y-full"
    }`}
  >
    <div className="flex flex-wrap justify-between items-center px-4">
      <div className="flex items-center cursor-pointer">
        <Link href={`/app`}>
          <Image
            src={"/favicon.png"}
            alt={"ProspectEdge"}
            width={40}
            height={40}
          />
        </Link>
        <Logo />
      </div>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            {isMenuOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              />
            )}
          </svg>
        </button>
      </div>
      <div className="hidden md:block flex-grow">
        <NavMenu scrollToSection={scrollToSection} />
      </div>
    </div>
    {isMenuOpen && (
      <div className="md:hidden w-full">
        <NavMenu scrollToSection={scrollToSection} />
      </div>
    )}
  </header>
);

const NavMenu: React.FC<{
  scrollToSection: (sectionId: string) => void;
}> = ({ scrollToSection }) => {
  const userMetadata = useAtomValue(userMetadataAtom);

  return (
    <nav
      className={`flex flex-col md:flex-row md:justify-end items-center space-y-4 md:space-y-0 md:space-x-8 bg-white md:bg-transparent p-4 md:p-0`}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("salesandmarketing");
          }}
          className="w-full md:w-auto text-center hover:text-primary-600 transition-colors"
        >
          Benefits
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("summary");
          }}
          className="w-full md:w-auto text-center hover:text-primary-600 transition-colors"
        >
          Features
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("pricing");
          }}
          className="w-full md:w-auto text-center hover:text-primary-600 transition-colors"
        >
          Pricing
        </a>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
        {userMetadata ? (
          <Link
            href={"/app"}
            className="w-full md:w-auto px-4 md:py-2 text-center md:bg-primary-600 text-black md:text-white rounded-full md:hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <a
              href="/auth/sign-in"
              className="w-full md:w-auto px-4 md:py-2 text-center md:hover:text-primary-600 transition-colors md:border rounded-full flex items-center justify-center"
            >
              Log In
            </a>
            <a
              href="/auth/sign-up"
              className="w-full md:w-auto px-4 md:py-2 text-center md:bg-primary-600 text-black md:text-white rounded-full md:hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

const MainContent: React.FC<{
  salesAndMarketingSectionRef: React.RefObject<HTMLElement>;
  featureSectionRef: React.RefObject<HTMLElement>;
  pricingSectionRef: React.RefObject<HTMLElement>;
}> = ({
  salesAndMarketingSectionRef,
  featureSectionRef,
  pricingSectionRef,
}) => (
  <main className="mt-16 sm:mt-16">
    <HeroSection />
    <SalesAndMarketingSection ref={salesAndMarketingSectionRef} />
    <SummarySection ref={featureSectionRef} />
    <BusinessSection />
    <CreditSection ref={pricingSectionRef} />
    <NewSection />
    <ScheduleDemo />
    <Footer />
  </main>
);

const HeroSection: React.FC = () => (
  <section
    id="hero"
    className="pt-20 sm:pt-32 md:pt-40 pb-12 sm:pb-16 px-4 gap-6 sm:gap-8 md:gap-10 flex flex-col items-center"
  >
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-tight sm:leading-snug md:leading-[1.4] font-bold text-center text-neutral-900 max-w-[994px] px-2 sm:px-5">
      Transform earnings transcripts and press releases to Sales & Marketing
      opportunities
      <span className="text-primary-500"> tailored to your offerings</span>
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl text-center font-normal leading-relaxed sm:leading-loose md:leading-9 max-w-3xl mx-auto text-neutral-500 px-2 sm:px-4">
      Discover your key account's mission critical projects, challenges & pain
      points and optimize your sales and marketing approach
    </p>
    <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
      <a
        href="/auth/sign-up"
        className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal rounded-full border bg-primary-500 border-primary-500 text-white hover:bg-primary-600 transition-colors duration-300"
      >
        Try for free
      </a>
      <p className="text-sm sm:text-base leading-5 sm:leading-6 font-normal text-[#9B9C9DFF]">
        Signup For Free. No card required.
      </p>
    </div>
  </section>
);

const SalesAndMarketingSection = React.forwardRef<HTMLElement>((props, ref) => (
  <section
    id="salesandmarketing"
    ref={ref}
    className="py-16 px-4 flex flex-col items-center"
  >
    <h1 className="text-3xl md:text-[40px] leading-tight md:leading-[56px] font-bold text-center max-w-[994px] px-4 md:px-10 flex flex-col">
      Avoid wasted sales & marketing efforts.
      <span className="text-primary-500">
        Focus your time on what matters most for your key accounts.
      </span>
    </h1>
    <p className="text-lg md:text-2xl leading-normal md:leading-9 font-normal text-neutral-600 text-center max-w-3xl mx-auto mt-3 mb-8 md:mb-16">
      Align your Sales and Marketing approach to meet your clients needs and
      focus areas.
    </p>
    <div className="flex flex-col items-center justify-center gap-10 md:gap-20 w-full max-w-[90rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Feature
          icon={
            <IoTelescope className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
          }
          title="Targeted Sales Opportunities"
          description="Identify top sales opportunities 
          tailored to your offerings & identify buyers."
        />
        <Feature
          icon={
            <FaPuzzlePiece className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
          }
          title="Account Based Marketing"
          description="Generate targeted marketing tactics for each account aligned to your offerings and customer needs."
        />
        <Feature
          icon={
            <FaBookReader className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
          }
          title="Actionable Insights"
          description="Discover key initiatives, priorities, challenges & pain points."
        />
        <Feature
          icon={
            <LuBrainCircuit className="w-8 h-8 md:w-12 md:h-12 text-primary-500" />
          }
          title="Prioritize Accounts"
          description="Identity and prioritize high-potential accounts based on financial outlook and earnings summary"
        />
      </div>
    </div>
  </section>
));

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
    <div className="rounded-full flex items-center justify-center w-20 h-20 md:w-[102px] md:h-[102px] bg-primary-50 flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col gap-1 max-w-[23rem]">
      <p className="text-primary-500 text-xl md:text-2xl leading-8 font-bold">
        {title}
      </p>
      <p className="text-gray-400 text-base md:text-xl">{description}</p>
    </div>
  </div>
);

const SummarySection = React.forwardRef<HTMLElement>((props, ref) => (
  <section
    id="summary"
    ref={ref}
    className="py-8 md:py-16 px-4 flex flex-col items-center"
  >
    <h1 className="text-3xl md:text-[42px] leading-tight md:leading-[60px] font-bold text-center max-w-[60rem] mb-3 md:mb-5">
      Tailored insights and opportunities{" "}
      <span className="text-primary-500">delivered to your inbox</span>
    </h1>
    <p className="text-base md:text-[18px] leading-normal md:leading-7 font-normal text-neutral-600 max-w-[70rem] text-center mb-8 md:mb-5">
      Customize your outreach using insights from executive statements in
      earnings calls and press releases for your key accounts. Understand
      customer priorities, key initiatives, challenges & painpoints.
    </p>

    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-6 mb-8 md:mb-5">
      <div className="w-full lg:w-1/2 h-[18rem] md:h-[22rem] relative">
        <video className="h-full w-full object-cover rounded-lg" controls>
          <source
            src="https://docs.material-tailwind.com/demo.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <SummaryContent />
    </div>
    <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
      <div className="w-full lg:w-1/2 h-[18rem] md:h-[22rem] relative">
        <video className="h-full w-full object-cover rounded-lg" controls>
          <source
            src="https://docs.material-tailwind.com/demo.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <DashboardContent />
    </div>
  </section>
));

const SummaryContent: React.FC = () => (
  <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 md:pr-0 max-w-full lg:max-w-[35rem]">
    <p className="text-gray-600 text-xs md:text-sm">
      TAILORED ACCOUNT SPECIFIC STRATEGIES
    </p>
    <p className="text-2xl md:text-4xl font-bold text-primary-500 leading-tight md:leading-[56px]">
      Targeted Sales & Marketing
    </p>
    <div className="flex flex-col gap-1 text-gray-600 text-sm">
      <ul className="list-disc text-base md:text-xl font-normal leading-relaxed md:leading-8 ml-5 md:ml-10">
        <li>
          Generate growth opportunities based on customer priorities and market
          trends
        </li>
        <li>
          Develop strategies using insights from earnings calls, press releases,
          and customer pain points to tailor your messaging and value
          proposition
        </li>
        <li>
          Gain an edge by addressing specific customer needs, optimizing
          engagement through customer-focused messaging
        </li>
      </ul>
    </div>
  </div>
);

const DashboardContent: React.FC = () => (
  <div className="flex flex-col gap-4 md:gap-6 p-4 md:p-6 md:pl-0 max-w-full lg:max-w-[35rem]">
    <p className="text-neutral-600 text-xs md:text-base">
      DATA DRIVEN CUSTOMER ENGAGEMENT
    </p>
    <p className="text-2xl md:text-4xl font-bold text-primary-500 leading-tight md:leading-[56px]">
      Actionable Insights
    </p>
    <div className="flex flex-col gap-1 text-gray-600 text-sm">
      <ul className="list-disc text-base md:text-xl font-normal leading-relaxed md:leading-8 ml-5 md:ml-10">
        <li>
          Identify key business priorities and mission-critical projects driving
          customer decisions. Understand their core focus areas to tailor your
          approach.
        </li>
        <li>
          Reveal critical pain points and obstacles affecting your target
          accounts most important objectives. Recognize how these challenges
          impact their strategic goals.
        </li>
        <li>
          Demonstrate how your solutions directly support their mission-critical
          projects and focus areas, enhancing your conversion potential.
        </li>
      </ul>
    </div>
  </div>
);

const BusinessSection: React.FC = () => (
  <section id="business" className="py-16 px-4 flex flex-col items-center">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem] mb-16 sm:mb-24 md:mb-32">
      What it means for <span className="text-primary-500">your business</span>
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-3 w-full items-start justify-center max-w-[80rem] gap-6">
      <BusinessFeature
        icon={
          <FaClock className="text-primary-500 w-16 h-16 sm:w-20 sm:h-20" />
        }
        title="TARGETED APPROACH"
        description="Align your sales and marketing approach to customers' most critical needs and projects."
      />
      <BusinessFeature
        icon={
          <FaRecycle className="text-primary-500 w-16 h-16 sm:w-20 sm:h-20" />
        }
        title="IMPROVE WIN RATES"
        description="Boost your conversion rate by aligning to customers' focus areas"
      />
      <BusinessFeature
        icon={
          <MdOutlineToken className="text-primary-500 w-16 h-16 sm:w-20 sm:h-20" />
        }
        title="BETTER PIPELINE QUALITY"
        description="Enhance pipeline quality through data-driven insights into customers' top priorities"
      />
    </div>
  </section>
);

const BusinessFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 max-w-[25rem] w-full px-4 sm:px-0">
    {icon}
    <p className="text-primary-500 text-xl sm:text-2xl font-bold leading-8 sm:leading-9 text-center">
      {title}
    </p>
    <p className="text-center text-lg sm:text-xl leading-7 sm:leading-8 font-medium text-neutral-900 w-full sm:w-[15rem]">
      {description}
    </p>
  </div>
);

const CreditSection = React.forwardRef<HTMLElement>((props, ref) => (
  <section
    id="pricing"
    className="py-16 px-4 flex flex-col items-center gap-10"
  >
    <div className="text-[40px] leading-[56px] font-bold text-center max-w-[60rem]">
      <span className="text-primary-500">Compare our plans</span> and find yours
      <p className="text-base text-neutral-500 font-normal leading-[26px] mt-3">
        Start for free or choose among our paid plans for more power
      </p>
    </div>
    <div className="w-full max-w-7xl mx-auto font-sans p-4">
      <div className="flex justify-center mb-16">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <button className="text-white bg-blue-600 py-2 px-4 rounded-full text-sm font-medium">
            Monthly
          </button>
          <button className="text-gray-700 py-2 px-4 rounded-full text-sm font-medium">
            Yearly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
          <div className="text-left">
            <h4 className="text-gray-800 font-semibold text-2xl">Free</h4>
            <h3 className="text-gray-800 font-semibold text-3xl mt-4">
              $0
              <span className="text-sm font-medium text-gray-600 ml-1">
                / user
              </span>
              <span className="text-sm font-medium text-gray-600 ml-1">
                / month
              </span>
            </h3>
            <button
              type="button"
              className="w-full mt-8 px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300"
            >
              Sign Up
            </button>
          </div>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex-1 w-full">
                General Summary of Earnings Call, Latest News & Press Releases
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex-1 w-full">
                General Insights into Company Priorities, Challenges, Pain
                Points & Key Initiatives
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex-1 w-full">
                Top general sales Opportunities based for the company earnings,
                news & updates
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex-1 w-full">
                Top general Marketing Tactics based on the company profile
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex-1 w-full">
                Max 1 Watch List to track companies
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-xl p-8 transform scale-105 border-2 border-blue-500 relative">
          <span className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
            Popular
          </span>
          <div className="text-left">
            <h4 className="text-gray-800 font-semibold text-2xl">Premium</h4>
            <h3 className="text-gray-800 font-semibold text-3xl mt-4">
              $99
              <span className="text-sm font-medium text-gray-600 ml-1">
                / user
              </span>
              <span className="text-sm font-medium text-gray-600 ml-1">
                / month
              </span>
            </h3>
            <button
              type="button"
              className="w-full mt-8 px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300"
            >
              Subscribe
            </button>
          </div>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Everything in Free Tier
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Tailored insights into Company Priorities, Challenges, Pain
                Points & Key Initiatives to your offerings
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Tailored sales Opportunities based on your offerings
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Identify buyers for each opportunity
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Tailored inobund and outbound strategies each sales opportunity
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Tailored Marketing Strategy based on your offerings
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Unlimited Watch Lists to track companies
              </span>
            </li>
            <li className="flex items-center justify-center ">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Emailed to your Inbox
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Priority Support
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
          <div className="text-left">
            <h4 className="text-gray-800 font-semibold text-2xl">Enterprise</h4>
            <h3 className="text-gray-800 font-semibold text-3xl mt-4">
              Custom
            </h3>
            <button
              type="button"
              className="w-full mt-8 px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-full transition duration-300"
            >
              Contact Sales
            </button>
          </div>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Custom Integrations to existing CRM & systems
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Personalized onboarding and training
              </span>
            </li>
            <li className="flex items-center justify-center">
              <svg
                className="w-9 h-9 text-blue-600 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600 text-sm flex w-full">
                Custom AI implementation
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
));

const NewSection: React.FC = () => (
  <section id="new" className="py-16 px-4 flex flex-col items-center gap-10">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem]">
      What's new?
    </h1>

    <p className="text-gray-600">Explore our blogs</p>

    <div className="flex flex-col md:flex-row w-full max-w-[80rem] items-center md:items-start justify-around gap-6">
      <BlogCard
        title="5 Game-Changing Ways AI-Powered Market Intelligence is Revolutionizing B2B Sales"
        description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
        src="/image/blog-1.jpg"
      />
      <BlogCard
        title="7 Innovative Strategies AI-Driven Market Insights are Transforming B2B Sales"
        description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
        src="/image/blog-2.jpg"
      />
      <BlogCard
        title="6 Innovative Approaches AI-Driven Market Intelligence is Shaping B2B Sales"
        description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
        src="/image/blog-3.jpg"
      />
    </div>
  </section>
);

const BlogCard: React.FC<{
  title: string;
  description: string;
  src: string;
}> = ({ title, description, src }) => (
  <div className="border shadow rounded-md overflow-hidden w-auto max-w-sm mx-auto">
    <div className="w-full h-48 sm:h-64 bg-primary-100">
      <Image
        src={src}
        alt="Blog image"
        width={480}
        height={400}
        className="object-cover w-full h-full"
      />
    </div>
    <div className="p-4">
      <p className="font-bold text-lg sm:text-xl line-clamp-2 mb-4">{title}</p>
      <span>
        <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-2">
          {description}
        </p>
        <button className="text-primary-500 text-sm sm:text-base">
          Read more
        </button>
      </span>
    </div>
  </div>
);

const ScheduleDemo: React.FC = () => (
  <div className="flex flex-col xl:flex-row w-full justify-center items-center gap-8 lg:gap-20 py-16 px-4 xl:px-0">
    <div className="w-full xl:w-[577px] h-[300px] lg:h-[512px] bg-primary-100 rounded-lg">
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        alt="Business team collaborating"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div className="flex flex-col w-full lg:max-w-[600px]">
      <h2 className="text-3xl lg:text-6xl font-bold leading-tight lg:leading-[64px] text-[#171A1FFF] mb-6 lg:mb-8 text-center lg:text-left">
        Generate your opportunities
      </h2>
      <div className="flex flex-col w-full gap-4 lg:gap-6">
        <input
          placeholder="Name"
          className="peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b border-blue-gray-200 bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        />
        <input
          placeholder="Company"
          className="peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b border-blue-gray-200 bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        />
        <input
          placeholder="Email address"
          className="peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b border-blue-gray-200 bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        />
        <button className="mt-4 lg:mt-6 w-full bg-primary-500 text-white rounded-full text-base lg:text-lg font-semibold py-3 lg:py-4 hover:bg-primary-600 active:bg-primary-700 transition-colors">
          Schedule a demo
        </button>
      </div>
    </div>
  </div>
);

const Footer: React.FC = () => (
  <footer id="cta" className="mt-20">
    <div className="flex flex-col px-4 sm:px-6 lg:px-20 lg:flex-row justify-between items-center w-full">
      <div className="flex flex-col items-center lg:items-start mb-8 lg:mb-0">
        <div className="flex items-center">
          <Image
            src={"/favicon.png"}
            alt={"ProspectEdge"}
            width={40}
            height={40}
          />
          <Logo />
        </div>
        <div className="flex flex-row gap-4 mt-6 lg:mt-8 lg:ml-[100px]">
          {[{ alt: "linkedin", src: "/icons/phosphor-linkedin-logo.svg" }].map(
            (icon, index) => (
              <div
                key={index}
                className="p-2 border border-solid border-[#F3F4F6FF] rounded-sm"
              >
                <Image width={24} height={24} alt={icon.alt} src={icon.src} />
              </div>
            )
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:flex sm:flex-row gap-8 sm:gap-12 lg:gap-20 lg:mr-20">
        {[
          { title: "Product", items: ["Features", "Pricing"] },
          { title: "Resources", items: ["Blog", "User guides"] },
          { title: "Legal", items: ["Privacy", "Terms"] },
        ].map((section, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 text-sm font-medium text-[#171A1FFF]"
          >
            <p className="font-semibold">{section.title}</p>
            {section.items.map((item, itemIndex) => (
              <p key={itemIndex}>{item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-col items-center lg:flex-row lg:justify-between px-4 sm:px-6 lg:px-20 mt-12 lg:mt-20 py-8 border-t border-[#F3F4F6FF]">
      <div className="flex flex-col gap-1 text-center lg:text-left mb-4 lg:mb-0"></div>
      <div className="flex">
        <p className="text-xs font-normal text-[#6F7787FF] leading-5">
          @2024 ProspectEdge. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default LandingPage;
