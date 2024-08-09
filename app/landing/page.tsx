"use client";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import {
  FaArrowRight,
  FaClock,
  FaRecycle,
  FaUser,
  FaBookReader
} from "react-icons/fa";
import { FaPuzzlePiece } from "react-icons/fa6";
import { LuBrainCircuit } from "react-icons/lu";
import { MdOutlineToken } from "react-icons/md";
import { IoTelescope } from "react-icons/io5";

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
  toggleMenu
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
  toggleMenu
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
    <ScheduleDemo />
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
    className="pb-20 px-4 flex flex-col items-center"
  >
    <h1 className="text-4xl sm:text-5xl font-bold text-center max-w-[60rem] mb-16">
      Targeted sales & marketing opportunities, specific to each customer
    </h1>
    <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto mb-32">
      A comprehensive platform that transforms complex market and financial data
      into clear, actionable strategies for B2B sales and marketing teams
    </p>
    <div className="flex flex-col lg:flex-row items-center gap-20 min-w-[80rem]">
      <div className="flex flex-col justify-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
          alt="Business analytics dashboard"
          className="w-full lg:w-[30rem] h-[20rem] object-cover rounded-lg shadow-lg mb-12 lg:mb-0"
        />
        <button className="flex text-primary-600 items-center gap-2 text-sm sm:text-base">
          <span>Try it yourself</span>
          <FaArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Feature
          icon={<IoTelescope className="w-8 h-8 text-primary-500" />}
          title="Opportunity discovery"
          description="Uncover selling opportunities aligned with your offerings."
        />
        <Feature
          icon={<FaPuzzlePiece className="w-8 h-8 text-primary-500" />}
          title="Marketing strategy development"
          description="Generate targeted tactics for each account"
        />
        <Feature
          icon={<FaBookReader className="w-8 h-8 text-primary-500" />}
          title="Earnings data summaries"
          description="Identify and prioritize high-potential accounts"
        />
        <Feature
          icon={<LuBrainCircuit className="w-8 h-8 text-primary-500" />}
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
    <div className="rounded-full flex items-center justify-center w-16 h-16 bg-primary-50 flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col gap-1 max-w-80">
      <p className="text-gray-600">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const SummarySection: React.FC = () => (
  <section
    id="summary"
    className="py-12 sm:py-16 md:py-20 px-4 flex flex-col items-center"
  >
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem] mb-8 sm:mb-12 md:mb-16">
      We focus on the data summaries, so you can focus on customer relationships
    </h1>

    <div className="flex flex-col md:flex-row items-center gap-6 mb-12 md:mb-16">
      <div className="w-full md:w-1/2 h-[20rem] sm:h-[25rem] relative mb-6 md:mb-0">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Living education"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <SummaryContent />
    </div>
    <div className="flex flex-col md:flex-row-reverse items-center gap-6">
      <div className="w-full md:w-1/2 h-[20rem] sm:h-[25rem] relative mb-6 md:mb-0">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Data analysis"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <DashboardContent />
    </div>
  </section>
);

const SummaryContent: React.FC = () => (
  <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 md:p-10 md:pr-0 max-w-full md:max-w-[35rem]">
    <p className="text-gray-600 text-sm sm:text-base">
      TAILORED ACCOUNT SPECIFIC STRATEGIES
    </p>
    <p className="text-xl font-medium">
      Data driven executive summaries that empower leadership to make informed
      strategic decisions to grow the business
    </p>
    <div className="flex flex-col gap-1 text-gray-600 text-sm">
      <p>
        C-suite executives need a bird's-eye view of performance and market
        positioning. ProspectEdge platform can:
      </p>
      <p>
        - Identify growth opportunities and potential risks based on revenue
        trends and market sentiment{" "}
      </p>
      <p>
        - Provide a holistic view of company performance and competitive
        positioning
      </p>
      <p>- Develop tailored strategies backed by data-driven insights</p>
    </div>
    <button className="flex text-primary-600 items-center gap-2 text-sm sm:text-base">
      <span>Learn more</span>
      <FaArrowRight />
    </button>
  </div>
);

const DashboardContent: React.FC = () => (
  <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 md:p-10 md:px-0 max-w-full md:max-w-[35rem]">
    <p className="text-gray-600 text-sm sm:text-base">
      REAL TIME DATA DRIVING CUSTOMER CONVERSATIONS
    </p>
    <p className="text-xl font-medium">
      A comprehensive view that enables effective positioning & differentiation
      in competitive situations
    </p>
    <div className="flex flex-col gap-1 text-gray-600 text-sm">
      <p>
        Understanding your competitive landscape is crucial. AI-powered market
        intelligence takes this to the next level:
      </p>
      <p>- Monitoring customer health metrics and financial performance </p>
      <p>
        {" "}
        - Generating automated dashboards combining financial insights, market
        data, and real-time trends{" "}
      </p>
      <p>
        {" "}
        - Tracking competitor financial performance and market positioning in
        real-time - Analyzing news sentiment to gauge market perception
      </p>
    </div>
    <button className="flex text-primary-600 items-center gap-2 text-sm sm:text-base">
      <span>Learn more</span>
      <FaArrowRight />
    </button>
  </div>
);

const BusinessSection: React.FC = () => (
  <section
    id="business"
    className="py-12 sm:py-16 md:py-20 px-4 flex flex-col items-center"
  >
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem] mb-16 sm:mb-24 md:mb-32">
      We focus on the data, so you can focus on your customers
    </h1>

    <div className="flex flex-col sm:flex-row w-full items-center sm:items-start justify-around max-w-[80rem] gap-12 sm:gap-6">
      <BusinessFeature
        icon={<FaClock className="text-primary-500 w-8 h-8 sm:w-10 sm:h-10" />}
        title="INCREASED PRODUCTIVITY"
        description="Get more revenue per sales person"
      />
      <BusinessFeature
        icon={
          <FaRecycle className="text-primary-500 w-8 h-8 sm:w-10 sm:h-10" />
        }
        title="IMMEDIATE ROI"
        description="Start generating more value from your leads from day 1"
      />
      <BusinessFeature
        icon={
          <MdOutlineToken className="text-primary-500 w-8 h-8 sm:w-10 sm:h-10" />
        }
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
  <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-[18rem] sm:max-w-60 w-full">
    {icon}
    <p className="text-gray-600 text-base sm:text-lg text-center">{title}</p>
    <p className="text-center text-sm sm:text-base">{description}</p>
  </div>
);

const NewSection: React.FC = () => (
  <section id="new" className="py-20 px-4 flex flex-col items-center gap-10">
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
  <div className="border shadow rounded-md overflow-hidden w-full md:w-auto max-w-sm mx-auto">
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
  <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-8 lg:gap-20 py-20 px-4 lg:px-0">
    <div className="w-full lg:w-[577px] h-[300px] lg:h-[512px] bg-primary-100 rounded-lg">
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        alt="Business team collaborating"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div className="flex flex-col w-full lg:max-w-[600px]">
      <h2 className="text-4xl lg:text-6xl font-bold leading-tight lg:leading-[64px] text-[#171A1FFF] mb-6 lg:mb-8">
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
        <button className="mt-4 lg:mt-6 w-full bg-[#379AE6FF] text-white rounded-full text-base lg:text-lg font-semibold py-3 lg:py-4 hover:bg-[#197DCAFF] active:bg-[#166DB0FF] transition-colors">
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
          <Image
            src={"/logo.png"}
            alt={"ProspectEdge"}
            width={200}
            height={40}
          />
        </div>
        <div className="flex flex-row gap-4 mt-6 lg:mt-8 lg:ml-[100px]">
          {[
            { alt: "tiktok", src: "/icons/phosphor-tiktok-logo.svg" },
            { alt: "facebook", src: "/icons/phosphor-facebook-logo.svg" },
            { alt: "youtube", src: "/icons/phosphor-youtube-logo.svg" },
            { alt: "linkedin", src: "/icons/phosphor-linkedin-logo.svg" }
          ].map((icon, index) => (
            <div
              key={index}
              className="p-2 border border-solid border-[#F3F4F6FF] rounded-sm"
            >
              <Image width={24} height={24} alt={icon.alt} src={icon.src} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-20 lg:mr-20">
        {[
          { title: "Product", items: ["Features", "Pricing"] },
          { title: "Resources", items: ["Blog", "User guides", "Webinars"] },
          { title: "Company", items: ["About", "Join us"] }
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
    <div className="flex flex-col mx-[200px] lg:flex-row justify-between items-center lg:mt-20 py-8 border-t border-[#F3F4F6FF]">
      <div className="flex flex-col gap-1 text-center lg:text-left mb-4 lg:mb-0">
        <p className="font-semibold text-base leading-[26px] text-[#171A1FFF]">
          Ultimated with love
        </p>
        <p className="text-xs leading-5 font-normal text-[#6F7787FF]">
          Quis labore ut labore proident in ea est aliqua
        </p>
      </div>
      <div className="flex">
        <p className="text-xs font-normal text-[#6F7787FF] leading-5">
          @2024 ProspectEdge. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default LandingPage;
