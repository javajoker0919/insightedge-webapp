"use client";
import React, { useState } from "react";
import { IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import { createCheckoutSession } from "@/utils/apiClient";
import { useRouter } from "next/navigation";

interface PlanFeature {
  name: string;
  free: string | boolean;
  standard: string | boolean;
}

const PricingTable: React.FC = () => {
  const router = useRouter();
  const features: PlanFeature[] = [
    { name: "General AI insights", free: true, standard: true },
    { name: "General AI recommendations", free: true, standard: true },
    { name: "Personalized AI insights", free: true, standard: true },
    { name: "Personalized sales opportunit", free: true, standard: true },
    { name: "Email newsletters", free: false, standard: false },
    { name: "Prospect recommendations", free: "upto 10", standard: "upto 20" },
  ];

  const credits: PlanFeature[] = [
    { name: "AI credits", free: "10", standard: "20" },
    { name: "Additional AI credits", free: false, standard: "$x/ 10 credits" },
  ];

  return (
    <div className="max-w-4xl m-auto pb-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm font-medium text-gray-700 bg-white p-2 rounded-md hover:bg-gray-50"
      >
        ← Go Back
      </button>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1"></div>
        <PlanHeader title="FREE" price="$0" />
        <PlanHeader title="STANDARD" price="$99" />

        {features.map((feature, index) => (
          <FeatureRow key={index} feature={feature} />
        ))}

        <div className="col-span-3 mt-6 mb-2">
          <h3 className="text-xl font-bold">Credits</h3>
        </div>

        {credits.map((credit, index) => (
          <FeatureRow key={index} feature={credit} />
        ))}
      </div>
    </div>
  );
};

interface PlanHeaderProps {
  title: string;
  price: string;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ title, price }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubscribe = async (plan: string): Promise<void> => {
    if (plan === "STANDARD") {
      setIsLoading(true);
      try {
        const response = await createCheckoutSession(plan);
        router.push(response.url);
      } catch (error) {
        console.error("Error creating checkout session:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="text-center space-y-4 p-2 pt-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="flex items-center justify-center gap-2">
        <p className="text-3xl font-bold">{price}</p>
        <p className="text-sm text-gray-500">/ user / month</p>
      </div>
      <button
        className="w-full py-2 px-4 border border-gray-300 rounded-md text-white hover:bg-primary-600 bg-primary-500"
        onClick={() => handleSubscribe(title)}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
        ) : (
          "Subscribe"
        )}
      </button>
    </div>
  );
};

interface FeatureRowProps {
  feature: PlanFeature;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ feature }) => (
  <>
    <div className="flex items-center">{feature.name}</div>
    <FeatureCell value={feature.free} />
    <FeatureCell value={feature.standard} />
  </>
);

interface FeatureCellProps {
  value: string | boolean;
}

const FeatureCell: React.FC<FeatureCellProps> = ({ value }) => (
  <div className="flex justify-center items-center">
    {typeof value === "boolean" ? (
      value ? (
        <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
      ) : (
        <IoCloseOutline className="text-gray-400 text-xl" />
      )
    ) : (
      <span>{value}</span>
    )}
  </div>
);

export default PricingTable;
