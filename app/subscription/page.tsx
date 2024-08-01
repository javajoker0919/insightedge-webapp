"use client";
import React, { useState, useEffect } from "react";
import { IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import { createCheckoutSession } from "@/utils/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";

import { useToastContext } from "@/contexts/toastContext";
import { userInfoAtom, watchlistAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

interface PlanFeature {
  name: string;
  free: string | boolean;
  standard: string | boolean;
}

const PricingTable: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { invokeToast } = useToastContext();
  const userInfo = useAtomValue(userInfoAtom);
  const watchlist = useAtomValue(watchlistAtom);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (userInfo) {
        const { data: userPlan, error: userPlanError } = await supabase
          .from("user_plans")
          .select("plan_id")
          .eq("user_id", userInfo.id)
          .single();

        if (userPlanError) {
          console.error("Error fetching user plan:", userPlanError);
          return;
        }

        if (userPlan) {
          const { data: plan, error: planError } = await supabase
            .from("plans")
            .select("name")
            .eq("id", userPlan.plan_id)
            .single();

          if (planError) {
            console.error("Error fetching plan:", planError);
            return;
          }

          setCurrentPlan(plan.name.toUpperCase());
        }

        setIsLoading(false);
      }
    };

    fetchCurrentPlan();
  }, [userInfo]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success" && watchlist && watchlist.length > 0) {
      invokeToast("success", "Subscription successful!", "top");
      router.replace(`/app/watchlist/${watchlist[0].uuid}`);
    } else if (status === "cancel") {
      invokeToast("error", "Subscription cancelled.", "top");
      router.replace("/subscription");
    }
  }, [searchParams, router, watchlist]);

  if (isLoading) {
    return (
      <div className="m-auto">
        <span className="ml-2 inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

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
        <PlanHeader title="FREE" price="$0" currentPlan={currentPlan} />
        <PlanHeader title="STANDARD" price="$99" currentPlan={currentPlan} />

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
  currentPlan: string | null;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  title,
  price,
  currentPlan,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const userInfo = useAtomValue(userInfoAtom);

  const handleSubscribe = async (plan: string): Promise<void> => {
    if (plan === "STANDARD" && userInfo) {
      setIsLoading(true);
      try {
        const response = await createCheckoutSession(
          plan.toLowerCase(),
          userInfo.id
        );
        router.push(response.url);
      } catch (error) {
        console.error("Error creating checkout session:", error);
        toast.error("Failed to create checkout session. Please try again.");
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
        className={`w-full py-2 px-4 border border-gray-300 rounded-md text-white ${
          title == currentPlan?.toUpperCase() ? "bg-gray-500" : "bg-primary-500"
        }`}
        onClick={() => handleSubscribe(title)}
        disabled={isLoading || currentPlan?.toUpperCase() == title}
      >
        {isLoading ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
        ) : title == currentPlan?.toUpperCase() ? (
          "Current plan"
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
