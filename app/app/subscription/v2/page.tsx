import React from "react";
import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface Feature {
  title: string;
  icon: "check" | "cross";
  value?: string;
}

interface Credit {
  title: string;
  icon?: "check" | "cross";
  value?: string;
}

interface PricingPlanProps {
  title: string;
  price: string;
  features: Feature[];
  credits: Credit[];
}

const PricingCard: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-8 pb-8">
      <div className="flex gap-16">
        <PricingPlan
          title="FREE"
          price="$0"
          features={[
            { title: "General AI insights", icon: "check" },
            { title: "General AI recommendations", icon: "check" },
            { title: "Personalized AI insights", icon: "check" },
            { title: "Personalized sales opportunit", icon: "check" },
            { title: "Email newsletters", icon: "cross" },
            {
              title: "Prospect recommendations",
              icon: "check",
              value: "upto 10",
            },
          ]}
          credits={[
            { title: "AI credits", value: "10" },
            { title: "Additional AI credits", icon: "cross" },
          ]}
        />
        <PricingPlan
          title="STANDARD"
          price="$99"
          features={[
            { title: "General AI insights", icon: "check" },
            { title: "General AI recommendations", icon: "check" },
            { title: "Personalized AI insights", icon: "check" },
            { title: "Personalized sales opportunit", icon: "check" },
            { title: "Email newsletters", icon: "cross" },
            {
              title: "Prospect recommendations",
              icon: "check",
              value: "upto 20",
            },
          ]}
          credits={[
            { title: "AI credits", value: "20" },
            {
              title: "Additional AI credits",
              icon: "check",
              value: "$x / 10 credits",
            },
          ]}
        />
      </div>
    </div>
  );
};

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  features,
  credits,
}) => {
  return (
    <div className="flex border border-gray-100 flex-col gap-6 rounded-xl shadow-md p-6 w-96 bg-white">
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-primary-500">{price}</div>
          <div className="text-sm text-gray-500">/ user / month</div>
        </div>
      </div>
      <button className="bg-primary-500 text-white font-bold py-2 px-4 rounded-md">
        Subscribe
      </button>
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold text-gray-800">Key features</h4>
        {features.map((feature, index) => (
          <Feature
            key={index}
            title={feature.title}
            icon={feature.icon}
            value={feature.value}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold text-gray-800">Credits</h4>
        {credits.map((credit, index) => (
          <Credit
            key={index}
            title={credit.title}
            icon={credit.icon}
            value={credit.value}
          />
        ))}
      </div>
    </div>
  );
};

const Feature: React.FC<Feature> = ({ title, icon, value }) => {
  return (
    <div className="flex gap-2 items-center">
      {icon === "check" ? (
        <FiCheck className="text-green-500" />
      ) : (
        <IoClose className="text-gray-500" />
      )}
      <span className="text-gray-800">{title}</span>
      {value && <span className="text-gray-500 ml-auto">{value}</span>}
    </div>
  );
};

const Credit: React.FC<Credit> = ({ title, icon, value }) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-gray-800">{title}</span>
      {icon === "check" ? (
        <FiCheck className="text-green-500" />
      ) : icon === "cross" ? (
        <IoClose className="text-gray-500" />
      ) : null}
      {value && <span className="text-gray-500 ml-auto">{value}</span>}
    </div>
  );
};

export default PricingCard;
