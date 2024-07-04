"use client";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full text-black bg-gradient-to-b from-white to-blue-50">
      <header
        className={`py-4 fixed top-0 left-0 right-0 bg-white z-10 shadow-md transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="container mx-auto flex justify-between items-center px-4">
          <div className="text-2xl font-bold text-blue-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            InsightEdge
          </div>
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-blue-600">
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
          </div>
          <ul
            className={`sm:flex ${
              isMenuOpen ? "block" : "hidden"
            } flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 absolute sm:relative top-full left-0 right-0 bg-white sm:bg-transparent p-4 sm:p-0`}
          >
            <li className="flex items-center">
              <a
                href="/auth/sign-in"
                className="hover:text-blue-600 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign In
              </a>
            </li>
            <li>
              <a
                href="/auth/sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Sign Up
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mt-16 sm:mt-16">
        <section
          id="hero"
          className="py-20 px-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-down">
            Supercharge Your B2B Sales with AI Insights
          </h1>
          <p className="text-lg sm:text-xl mb-8 animate-fade-in-up">
            InsightEdge is the ultimate sales intelligence platform for B2B
            teams. Our AI-powered solution analyzes data from various sources to
            give you actionable insights and a competitive edge.
          </p>
          <a
            href="/auth/sign-in"
            className="bg-white text-blue-600 px-6 py-3 w-fit rounded-full text-lg hover:bg-gray-100 transition-colors animate-pulse flex items-center justify-center mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Get Started Today
          </a>
        </section>

        <section id="benefits" className="py-20 px-4 md:px-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              "Prioritize high-value accounts based on data-driven insights",
              "Understand customer needs through financial and market analysis",
              "Stay ahead of industry trends and opportunities",
              "Align sales and marketing efforts for personalized outreach",
              "Make informed decisions backed by real-time data",
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="py-20 px-4 md:px-20 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              "Intuitive dashboard with comprehensive insights",
              "Detailed account profiles for a 360-degree view",
              "Advanced AI algorithms to uncover opportunities and risks",
              "Real-time alerts on critical changes",
              "Easy integration with your existing sales workflow",
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <p className="text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className="py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Top B2B Companies
          </h2>
          <p className="text-xl text-center">
            Leading B2B organizations across various industries trust
            InsightEdge for their sales intelligence needs.
          </p>

          {/* Add logos or testimonials here */}
        </section>

        <section id="pricing" className="py-20 px-4 bg-gray-100">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="mb-4">Access general AI summaries and insights</p>
              <a
                href="#cta"
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Get Started
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <p className="mb-4">Unlock unlimited, personalized AI insights</p>
              <a
                href="#cta"
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer id="cta" className="bg-blue-600 text-white py-20 px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Get Started Today</h2>
          <p className="text-2xl mb-12">
            Sign up for InsightEdge now and unlock the power of AI-driven sales
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
              className="bg-blue-600 text-white px-6 py-2 w-fit min-w-fit rounded-r-full hover:bg-blue-700 transition-colors flex items-center text-base font-semibold border border-white"
            >
              Get Started
            </button>
          </form>
          <p className="text-lg">
            &copy; 2023 InsightEdge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
