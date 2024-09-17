import React from "react";
import {
  FaChartLine,
  FaBullseye,
  FaLightbulb,
  FaBalanceScale,
} from "react-icons/fa";
import { motion } from "framer-motion";

const LandingSalesAndMarketingSection = () => {
  return (
    <section
      id="salesandmarketing"
      className="py-24 px-4 relative overflow-hidden"
    >
      <ConnectingDesign />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800"
        >
          Avoid wasted sales & marketing efforts.{" "}
          <span className="text-primary-500 inline-block hover:scale-105 transition-transform">
            Focus on what matters most for your key accounts.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
        >
          {[
            {
              icon: <FaChartLine />,
              title: "Targeted Sales Opportunities",
              description:
                "Identify top sales opportunities tailored to your offerings & pinpoint decision-makers. Leverage AI-driven insights to craft personalized pitches that address specific pain points and increase your win rates.",
            },
            {
              icon: <FaBullseye />,
              title: "Account Based Marketing",
              description:
                "Generate targeted marketing tactics for each account, perfectly aligned with your offerings and customer needs. Utilize deep market intelligence to create highly relevant content and campaigns that resonate with your ideal customers.",
            },
            {
              icon: <FaLightbulb />,
              title: "Actionable Insights",
              description:
                "Uncover key initiatives, priorities, challenges & pain points within your target accounts. Transform raw data into strategic action plans that drive meaningful conversations and build stronger customer relationships.",
            },
            {
              icon: <FaBalanceScale />,
              title: "Prioritize Accounts",
              description:
                "Identify and prioritize high-potential accounts based on comprehensive financial outlook and earnings summaries. Focus your resources on the most promising opportunities to maximize ROI and accelerate growth.",
            },
          ].map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const Feature: React.FC<{
  icon: React.ReactElement;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: 0.2 + index * 0.1,
      ease: "easeOut",
    }}
    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
    className="bg-white rounded-xl p-8 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-100"
  >
    <div className="flex items-center mb-6">
      <div className="rounded-full p-3 bg-primary-100 text-primary-600 mr-4">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
    </div>
    <p className="text-base text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const ConnectingDesign = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient
        id="particle-gradient"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
      </radialGradient>
    </defs>
    {[...Array(20)].map((_, i) => (
      <motion.circle
        key={i}
        r="4"
        fill="url(#particle-gradient)"
        initial={{
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
          opacity: 0,
        }}
        animate={{
          x: [
            null,
            Math.random() * 100 + "%",
            Math.random() * 100 + "%",
            Math.random() * 100 + "%",
          ],
          y: [
            null,
            Math.random() * 100 + "%",
            Math.random() * 100 + "%",
            Math.random() * 100 + "%",
          ],
          opacity: [0, 0.7, 0.7, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </svg>
);

export default LandingSalesAndMarketingSection;
