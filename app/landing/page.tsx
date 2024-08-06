"use client";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { FaArrowRight, FaClock, FaRecycle, FaUser } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

interface HeaderProps {
  isHeaderVisible: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const LandingPage: React.FC = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

  return (
    <div className="w-full text-black bg-gradient-to-b">
      <Header
        isHeaderVisible={isHeaderVisible}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />
      <MainContent />
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  isHeaderVisible,
  isMenuOpen,
  toggleMenu,
}) => (
  <header
    className={`py-4 fixed top-0 left-0 right-0 bg-white z-10 shadow-md transition-transform duration-300 ${
      isHeaderVisible ? "translate-y-0" : "-translate-y-full"
    }`}
  >
    <div className="flex justify-between items-center px-4">
      <div className="flex items-center">
        <Image
          src={"/favicon.png"}
          alt={"ProspectEdge"}
          width={40}
          height={40}
        />
        <Image src={"/logo.png"} alt={"ProspectEdge"} width={200} height={40} />
      </div>
      {/* <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-primary-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div> */}
      <NavMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  </header>
);

const NavMenu: React.FC<{ isMenuOpen: boolean; toggleMenu: () => void }> = ({
  isMenuOpen,
  toggleMenu,
}) => (
  <div
    className={`sm:flex ${
      isMenuOpen ? "block" : "hidden"
    } flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12 absolute sm:relative top-full left-0 right-0 bg-white sm:bg-transparent p-4 sm:p-0`}
  >
    <div className="flex items-center gap-10">
      <a href="#" className="">
        Docs
      </a>
      <a href="#" className="">
        Pricing
      </a>
      <a href="#" className="">
        Guides
      </a>
    </div>
    <div className="flex items-center gap-6">
      <a
        href="/auth/sign-in"
        className="w-20 hover:text-primary-600 transition-colors border px-4 py-2 rounded-full flex items-center justify-center"
      >
        Log In
      </a>
      <a
        href="/auth/sign-up"
        className="w-20 bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors flex items-center justify-center"
      >
        Start
      </a>
    </div>
  </div>
);

const MainContent: React.FC = () => (
  <main className="mt-16 sm:mt-16">
    <HeroSection />
    <SalesAndMarketingSection />
    <SummarySection />
    <BusinessSection />
    <NewSection />
    <Footer />
  </main>
);

const HeroSection: React.FC = () => (
  <section id="hero" className="py-40 px-4 gap-16 flex flex-col items-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-center text-primary-600 max-w-[60rem]">
      Convert news and earnings transcripts to generate specific, actionable B2B
      sales & marketing opportunities
    </h1>
    <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto">
      Use insights and recommendations to tailor sales & marketing strategy for
      client specific needs
    </p>
    <div className="flex items-center gap-6">
      <button className="px-4 py-2 rounded-full border bg-primary-500 border-primary-500 text-white">
        Start for free
      </button>
      <button className="px-4 py-2 rounded-full border border-primary-500">
        Schedule demo
      </button>
    </div>
  </section>
);

const SalesAndMarketingSection: React.FC = () => (
  <section
    id="salesandmarketing"
    className="py-20 px-4 flex flex-col items-center"
  >
    <h1 className="text-4xl sm:text-5xl font-bold text-center max-w-[60rem] mb-16">
      Targeted sales & marketing opportunities, specific to each customer
    </h1>
    <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto mb-32">
      A comprehensive platform that transforms complex market and financial data
      into clear, actionable strategies for B2B sales and marketing teams
    </p>
    <div className="flex items-center gap-12">
      <div className="w-[30rem] h-[20rem] bg-primary-100"></div>
      <div className="grid grid-cols-2 gap-8">
        <Feature
          icon={<FaUser />}
          title="Opportunity discovery"
          description="Uncover selling opportunities aligned with your offerings."
        />
        <Feature
          icon={<FaUser />}
          title="Marketing strategy development"
          description="Generate targeted tactics for each account"
        />
        <Feature
          icon={<FaUser />}
          title="Earnings data summaries"
          description="Identify and prioritize high-potential accounts"
        />
        <Feature
          icon={<FaUser />}
          title="Competitive Intelligence"
          description="Stay ahead with real-time market insights"
        />
      </div>
    </div>
  </section>
);

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex gap-4">
    <div className="rounded-full flex items-center justify-center w-16 h-16 bg-primary-50">
      {icon}
    </div>
    <div className="flex flex-col gap-1 max-w-80">
      <p className="text-gray-600">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const SummarySection: React.FC = () => (
  <section id="summary" className="py-20 px-4 flex flex-col items-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-center max-w-[60rem] mb-16">
      We focus on the data summaries, so you can focus on customer relationships
    </h1>

    <div className="flex items-center gap-6">
      <SummaryContent />
      <div className="w-[30rem] h-[25rem] bg-primary-100"></div>
    </div>
    <div className="flex items-center gap-6">
      <div className="w-[30rem] h-[25rem] bg-primary-100"></div>
      <SummaryContent />
    </div>
  </section>
);

const SummaryContent: React.FC = () => (
  <div className="flex flex-col gap-6 p-10 pr-0 max-w-[30rem]">
    <p className="text-gray-600">TAILORED ACCOUNT SPECIFIC STRATEGIES</p>
    <p className="text-4xl font-bold">Actionable Summaries</p>
    <p className="text-gray-600">
      AI generated summaries of market data and strategies to build your
      marketing & sales engagement
    </p>
    <button className="flex text-primary-600 items-center gap-2">
      <span>Learn more</span>
      <FaArrowRight />
    </button>
  </div>
);

const BusinessSection: React.FC = () => (
  <section id="business" className="py-20 px-4 flex flex-col items-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-center max-w-[60rem] mb-32">
      What it means for your business
    </h1>

    <div className="flex w-full items-start justify-around gap-6">
      <BusinessFeature
        icon={<FaClock className="text-primary-500 w-10 h-10" />}
        title="INCREASED PRODUCTIVITY"
        description="Get more revenue per sales person"
      />
      <BusinessFeature
        icon={<FaRecycle className="text-primary-500 w-10 h-10" />}
        title="IMMEDIATE ROI"
        description="Start generating more value from your leads from day 1"
      />
      <BusinessFeature
        icon={<MdOutlineToken className="text-primary-500 w-10 h-10" />}
        title="REDUCED CHURN"
        description="When you can identify risks and opportunities for customers and partners"
      />
    </div>
  </section>
);

const BusinessFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center gap-6 max-w-60">
    {icon}
    <p className="text-gray-600 text-lg">{title}</p>
    <p className="text-center">{description}</p>
  </div>
);

const NewSection: React.FC = () => (
  <section id="new" className="py-20 px-4 flex flex-col items-center gap-16">
    <h1 className="text-4xl sm:text-5xl font-bold text-center max-w-[60rem]">
      What's new?
    </h1>

    <p className="text-gray-600">Explore our blogs</p>

    <div className="flex w-full max-w-6xl items-start justify-around gap-6">
      <BlogCard
        title="5 Game-Changing Ways AI-Powered Market Intelligence is Revolutionizing B2B Sales"
        description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
      />
      <BlogCard
        title="7 Innovative Strategies AI-Driven Market Insights are Transforming B2B Sales"
        description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
      />
      <BlogCard
        title="6 Innovative Approaches AI-Driven Market Intelligence is Shaping B2B Sales"
        description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
      />
    </div>
  </section>
);

const BlogCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="border shadow rounded-md overflow-hidden">
    <div className="w-full h-64 bg-primary-100"></div>
    <div className="p-4">
      {/* <p className="font-medium">01</p> */}
      <p className="font-bold line-clamp-2 mb-4">{title}</p>
      <span>
        <p className="text-gray-600 line-clamp-3 mb-2">{description}</p>
        <button className="text-primary-500">Read more</button>
      </span>
    </div>
  </div>
);

const Footer: React.FC = () => (
  <footer id="cta" className="bg-primary-600 text-white py-20 px-8">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold mb-8">Get Started Today</h2>
      <p className="text-2xl mb-12">
        Sign up for ProspectEdge now and unlock the power of AI-driven sales
        insights.
      </p>
      <form className="mb-8 flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-l-full text-black text-base w-56"
        />
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2 w-fit min-w-fit rounded-r-full hover:bg-primary-700 transition-colors flex items-center text-base font-semibold border border-white"
        >
          Get Started
        </button>
      </form>
      <p className="text-lg">&copy; 2024 ProspectEdge. All rights reserved.</p>
    </div>
  </footer>
);

export default LandingPage;
