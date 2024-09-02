import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBullseye, FaChartLine, FaLightbulb } from "react-icons/fa";

const features = [
  {
    icon: <FaBullseye className="text-primary-600" />,
    title: "Targeted Sales Opportunities",
    description:
      "Identify top sales opportunities tailored to your offerings & pinpoint decision-makers. Leverage AI-driven insights to craft personalized pitches that address specific pain points and increase your win rates.",
  },
  {
    icon: <FaChartLine className="text-primary-600" />,
    title: "Account Based Marketing",
    description:
      "Generate targeted marketing tactics for each account, perfectly aligned with your offerings and customer needs. Utilize deep market intelligence to create highly relevant content and campaigns that resonate with your ideal customers.",
  },
  {
    icon: <FaLightbulb className="text-primary-600" />,
    title: "Actionable Insights",
    description:
      "Uncover key initiatives, priorities, challenges & pain points within your target accounts. Transform raw data into strategic action plans that drive meaningful conversations and build stronger customer relationships.",
  },
];

const rotatingItems = [
  "Targeted Sales Opportunities",
  "Account Based Marketing",
  "Actionable Insights",
];

const FeatureHeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateItems = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingItems.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(rotateItems, 2000);
    return () => clearInterval(interval);
  }, [rotateItems]);

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-bold text-center">
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 mb-2 sm:mb-4 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-end justify-center text-[#004AAD] text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              >
                <span className="text-center px-2 leading-tight pb-1">
                  {rotatingItems[currentIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <span className="text-black block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 sm:mt-4">
            to Accelerate Your B2B Growth
          </span>
        </h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto text-center"
      >
        Leverage AI-driven insights to identify prime opportunities, create
        targeted campaigns, and make data-backed decisions that drive revenue.
      </motion.p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 max-w-xs h-56 overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-l-4 border-primary-600 relative"
          >
            <div className="flex items-center mb-4">
              <div className="rounded-full p-3 bg-primary-100 mr-3">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">{feature.description}</p>
            {index < features.length - 1 && (
              <svg
                className="absolute -right-4 top-1/2 transform -translate-y-1/2"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <line
                  x1="0"
                  y1="10"
                  x2="20"
                  y2="10"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureHeroSection;
