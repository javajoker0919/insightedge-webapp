import Link from "next/link";
import { useEffect, useState } from "react";

const LandingHeroSection = () => {
  const items = [
    "Earnings Calls",
    "10-K",
    "Press Releases",
    "Industry specific data",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2000); // Switch every 1 second

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-20 sm:pt-32 md:pt-40 pb-12 sm:pb-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            <span className="inline-block w-full h-[60px] sm:h-[70px] md:h-[80px] overflow-hidden relative">
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
            <br />
            to Sales & Marketing opportunities
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Discover your key account's mission critical projects, challenges &
            pain points and optimize your sales and marketing approach
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="px-8 py-3 text-lg font-medium text-white bg-primary-500 rounded-full hover:bg-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
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
