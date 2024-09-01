import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const LandingHeroSection = () => {
  const items = [
    "Earnings Calls",
    "10-K",
    "Press Releases",
    "Industry specific data",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateItems = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const interval = setInterval(rotateItems, 2000);
    return () => clearInterval(interval);
  }, [rotateItems]);

  return (
    <section
      id="hero"
      className="relative pt-16 sm:pt-24 md:pt-32 pb-8 sm:pb-12 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
            <span className="inline-block w-full h-[40px] sm:h-[50px] md:h-[60px] lg:h-[80px] overflow-hidden relative">
              {items.map((item, index) => (
                <span
                  key={item}
                  className={`block transition-transform duration-500 absolute w-full text-[#004AAD] ${
                    index === currentIndex
                      ? "translate-y-0"
                      : "-translate-y-full"
                  }`}
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item}
                </span>
              ))}
            </span>
            <br className="hidden sm:inline" />
            <span className="block sm:inline">
              to Sales & Marketing opportunities
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-10">
            Discover your key account's mission critical projects, challenges &
            pain points and optimize your sales and marketing approach
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-medium text-white bg-primary-500 rounded-full hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Try for free
            </Link>
            <p className="text-sm text-gray-500">No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHeroSection;
