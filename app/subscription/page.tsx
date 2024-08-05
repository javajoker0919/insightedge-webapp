"use client";
import React, { useState, useEffect } from "react";
import { IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import { createCheckoutSession, customerPortal } from "@/utils/apiClient";
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

  const features_1: string[] = [
    "General AI insights",
    "General AI recommendations",
    "Personalized AI insights",
    "Personalized sales opportunit",
    "Email newsletters",
    "Prospect recommendations",
  ];

  const features_2: string[] = ["AI credits", "Additional AI credits"];

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (userInfo) {
        const { data: userPlan, error: userPlanError } = await supabase
          .from("user_plans")
          .select("plan_id, stripe_subscription_id")
          .eq("user_id", userInfo.id)
          .order("created_at", { ascending: false });

        if (userPlanError) {
          console.error("Error fetching user plan:", userPlanError);
          return;
        }

        if (userPlan) {
          const { data: plan, error: planError } = await supabase
            .from("plans")
            .select("name")
            .eq("id", userPlan[0].plan_id)
            .single();

          if (planError) {
            console.error("Error fetching plan:", planError);
            return;
          }
          setCurrentPlan(plan.name);
        }

        setIsLoading(false);
      }
    };

    fetchCurrentPlan();
  }, [userInfo]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success" && userInfo) {
      invokeToast("success", "Subscription successful!", "top");
      router.replace(`/app/membership`);
    } else if (status === "cancel") {
      invokeToast("error", "Subscription cancelled.", "top");
      router.replace("/subscription");
    }
  }, [searchParams, router, userInfo]);

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
        onClick={() => router.push("/app/membership")}
        className="mb-4 text-sm font-medium text-gray-700 bg-white p-2 rounded-md hover:bg-gray-50"
      >
        ← Go Back
      </button>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="h-44"></div>
          {features_1.map((item) => {
            return (
              <div className="flex items-center h-12">
                <p>{item}</p>
              </div>
            );
          })}

          <p className="text-2xl font-medium h-20 items-center flex">Credits</p>
          {features_2.map((item) => {
            return (
              <div className="flex items-center h-12">
                <p>{item}</p>
              </div>
            );
          })}
        </div>

        <div
          className={`w-64 px-4 ${
            currentPlan == "free"
              ? "rounded-lg shadow-primary-100 border shadow-md"
              : ""
          }`}
        >
          <PlanHeader title="FREE" price="$0" currentPlan={currentPlan} />

          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center h-12 justify-center">
              <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
            </div>
          ))}

          <div className="flex items-center h-12 justify-center">
            <IoCloseOutline className="text-gray-400 text-xl" />
          </div>
          <div className="flex items-center h-12 justify-center">
            <p>up to 10</p>
          </div>
          <div className="h-20"></div>
          <div className="flex items-center h-12 justify-center">
            <p>10</p>
          </div>
          <div className="flex items-center h-12 justify-center">
            <IoCloseOutline className="text-gray-400 text-xl" />
          </div>
        </div>

        <div
          className={`w-64 px-4 ${
            currentPlan == "standard"
              ? "rounded-lg shadow-primary-100 border shadow-md"
              : ""
          }`}
        >
          <PlanHeader title="STANDARD" price="$99" currentPlan={currentPlan} />

          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center h-12 justify-center">
              <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
            </div>
          ))}

          <div className="flex items-center h-12 justify-center">
            <IoCloseOutline className="text-gray-400 text-xl" />
          </div>
          <div className="flex items-center h-12 justify-center">
            <p>up to 20</p>
          </div>
          <div className="h-20"></div>
          <div className="flex items-center h-12 justify-center">
            <p>20</p>
          </div>
          <div className="flex items-center h-12 justify-center">
            <p>$x / 10 credits</p>
          </div>
        </div>
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
    if (!userInfo) return;

    if (plan === "free") {
      setIsLoading(true);
      try {
        const response = await createCheckoutSession("standard");
        router.push(response.url);
      } catch (error) {
        console.error("Error creating checkout session:", error);
        toast.error("Failed to create checkout session. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (plan === "standard") {
      setIsLoading(true);
      try {
        const response = await customerPortal();
        router.push(response.url);
      } catch (error) {
        console.error("Error creating customer portal:", error);
        toast.error("Failed to create customer portal. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="text-center h-44 space-y-4 p-2 pt-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="flex items-center justify-center gap-2">
        <p className="text-3xl font-bold">{price}</p>
        <p className="text-sm text-gray-500">/ user / month</p>
      </div>
      {title === "FREE" && currentPlan === "free" && (
        <p className="w-full py-2 px-4 border border-gray-300 bg-gray-400 rounded-md text-white">
          Current Plan
        </p>
      )}
      {title === "STANDARD" && (
        <button
          className={`w-full py-2 px-4 border border-gray-300 bg-primary-500 disabled:bg-gray-400 rounded-md text-white disabled:cursor-not-allowed`}
          onClick={() =>
            handleSubscribe(currentPlan === "standard" ? "standard" : "free")
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
          ) : title == currentPlan?.toUpperCase() ? (
            "Check Subscription"
          ) : (
            "Subscribe"
          )}
        </button>
      )}
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
