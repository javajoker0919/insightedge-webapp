import React from "react";
import { FaUser, FaUsers, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface PlanProps {
  title: string;
  price: string;
  features: string[];
  icon: React.ReactNode;
}

const Plan: React.FC<PlanProps> = ({ title, price, features, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
    <div className="text-4xl text-indigo-600 mb-4">{icon}</div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-3xl font-bold text-indigo-600 mb-4">{price}</p>
    <ul className="text-left mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-2">
          <svg
            className="w-4 h-4 mr-2 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200">
      Upgrade Now
    </button>
  </div>
);

export default function UpgradePage() {
  const plans = [
    {
      title: "Individual",
      price: "$19.99/month",
      features: [
        "Access to all basic features",
        "Personal dashboard",
        "24/7 customer support",
      ],
      icon: <FaUser />,
    },
    {
      title: "Team",
      price: "$49.99/month",
      features: [
        "All Individual features",
        "Team collaboration tools",
        "Advanced analytics",
        "Priority support",
      ],
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="max-w-6xl m-auto px-4 py-12">
      <Link
        href="/app"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
      >
        <FaArrowLeft className="mr-2" />
        Back to Dashboard
      </Link>
      <h1 className="text-4xl font-bold text-center mb-8">
        Upgrade Your Subscription
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Choose the plan that best fits your needs and take your experience to
        the next level.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan, index) => (
          <Plan key={index} {...plan} />
        ))}
      </div>
    </div>
  );
}
