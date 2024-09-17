import React from "react";
import Link from "next/link";

const PlanCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  link: string;
  linkText: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  popular?: boolean;
}> = ({
  title,
  price,
  features,
  link,
  linkText,
  bgColor,
  gradientFrom,
  gradientTo,
  popular,
}) => {
  return (
    <div
      className={`bg-white/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 ${
        popular
          ? "bg-white/70 shadow-xl border-2 border-blue-500 transform scale-105 relative"
          : ""
      }`}
    >
      {popular && (
        <div className="bg-blue-500 text-white text-xs md:text-sm font-bold uppercase py-1 px-2 md:px-4 absolute right-0 top-0 rounded-bl-lg">
          Popular
        </div>
      )}
      <div
        className={`p-6 md:p-8 bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`}
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {title}
        </h3>
        <div className="text-3xl md:text-4xl font-bold text-gray-900">
          {price}{" "}
          <span className="text-base md:text-lg font-normal text-gray-600">
            / month
          </span>
        </div>
        <Link
          href={link}
          className={`block w-full mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm font-medium ${bgColor} text-white hover:bg-blue-700 rounded-full transition duration-300 text-center`}
        >
          {linkText}
        </Link>
      </div>
      <ul className="p-6 md:p-8 space-y-3 md:space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-600 text-sm">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Pricing: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      <PlanCard
        title="Free"
        price="$0"
        features={[
          "General Summary of Earnings Call, Latest News & Press Releases",
          "General Insights into Company Priorities, Challenges, Pain Points & Key Initiatives",
          "Top general sales Opportunities based for the company earnings, news & updates",
          "Top general Marketing Tactics based on the company profile",
          "Max 1 Watch List to track companies",
        ]}
        link="/auth/sign-up"
        linkText="Sign Up"
        bgColor="bg-blue-600"
        gradientFrom="blue-50/70"
        gradientTo="purple-50/70"
      />
      <PlanCard
        title="Premium"
        price="$99"
        features={[
          "Everything in Free Tier",
          "Tailored insights into Company Priorities, Challenges, Pain Points & Key Initiatives to your offerings",
          "Tailored sales Opportunities based on your offerings",
          "Identify buyers for each opportunity",
          "Tailored inbound and outbound strategies for each sales opportunity",
          "Tailored Marketing Strategy based on your offerings",
          "Unlimited Watch Lists to track companies",
          "Emailed to your Inbox",
          "Priority Support",
        ]}
        link="/auth/sign-up"
        linkText="Sign Up"
        bgColor="bg-blue-600"
        gradientFrom="blue-100/70"
        gradientTo="purple-100/70"
        popular
      />
      <PlanCard
        title="Enterprise"
        price="Custom"
        features={[
          "Custom Integrations to existing CRM & systems",
          "Personalized onboarding and training",
          "Custom AI implementation",
        ]}
        link="https://calendly.com/pratik-padooru-prospectedge/30min"
        linkText="Contact Sales"
        bgColor="bg-gray-800"
        gradientFrom="gray-100/70"
        gradientTo="blue-100/70"
      />
    </div>
  );
};

export default Pricing;
