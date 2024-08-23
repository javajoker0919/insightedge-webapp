"use client";
import React, { useState, useEffect } from "react";
import { IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import { cancelSubscription, updatePlan } from "@/utils/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";

import { useToastContext } from "@/contexts/toastContext";
import { userInfoAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

const Plans = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { invokeToast } = useToastContext();
  const userInfo = useAtomValue(userInfoAtom);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFreePlanLoading, setIsFreePlanLoading] = useState<boolean>(false);
  const [isStandardPlanLoading, setIsStandardPlanLoading] =
    useState<boolean>(false);

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
          .select("plan_id")
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
      invokeToast("success", "Subscription successful!");
      router.replace(`/app/settings/billing`);
    } else if (status === "cancel") {
      invokeToast("error", "Subscription cancelled.");
      router.replace("/app/settings/plans");
    }
  }, [searchParams, router, userInfo]);

  const handleChoosePlan = async (plan: string): Promise<void> => {
    if (!userInfo) return;

    if (plan === "free") {
      setIsFreePlanLoading(true);
      try {
        const response = await cancelSubscription();

        if (response.cancelation_dates) {
          response.cancelation_dates.forEach((date: number) => {
            const formattedDate = new Date(date * 1000).toLocaleDateString();
            toast.success(`Subscription set to cancel on ${formattedDate}.`);
          });
        } else {
          toast.error("Failed to cancel subscriptions. Please try again.");
        }
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        toast.error("Failed to cancel subscription. Please try again.");
      } finally {
        setIsFreePlanLoading(false);
      }
    } else {
      setIsStandardPlanLoading(true);
      try {
        const response = await updatePlan(plan);
        router.push(response.url);
      } catch (error) {
        console.error("Error creating checkout session:", error);
        toast.error("Failed to create checkout session. Please try again.");
      } finally {
        setIsStandardPlanLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl m-auto pb-6">
      <div className="grid grid-cols-3 gap-12">
        <div className="py-4">
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
          className={`w-64 p-4 border rounded-lg border-gray-200 ${
            currentPlan == "free" ? "shadow-primary-100 shadow-xl" : ""
          }`}
        >
          <div className="text-center h-44 space-y-4 p-2 pt-4">
            <h2 className="text-xl font-bold mb-2">FREE</h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">$0</p>
              <p className="text-sm text-gray-500">/ user / month</p>
            </div>

            <button
              className={`w-full py-2 px-4 border border-gray-300 bg-primary-500 disabled:bg-opacity-65 rounded-md text-white disabled:cursor-not-allowed`}
              onClick={() => handleChoosePlan("free")}
              disabled={
                isLoading || isFreePlanLoading || currentPlan === "free"
              }
            >
              {isLoading || isFreePlanLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              ) : currentPlan === "free" ? (
                "Current Plan"
              ) : (
                "Choose Plan"
              )}
            </button>
          </div>

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
          className={`w-64 p-4 border rounded-lg border-gray-200 ${
            currentPlan == "standard" ? "shadow-primary-100 shadow-xl" : ""
          }`}
        >
          <div className="text-center h-44 space-y-4 p-2 pt-4">
            <h2 className="text-xl font-bold mb-2">STANDARD</h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">$99</p>
              <p className="text-sm text-gray-500">/ user / month</p>
            </div>
            <button
              className={`w-full py-2 px-4 border border-gray-300 bg-primary-500 disabled:bg-opacity-65 rounded-md text-white disabled:cursor-not-allowed`}
              onClick={() => handleChoosePlan("standard")}
              disabled={
                isLoading || isStandardPlanLoading || currentPlan === "standard"
              }
            >
              {isLoading || isStandardPlanLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              ) : currentPlan == "standard" ? (
                "Current Plan"
              ) : (
                "Choose Plan"
              )}
            </button>
          </div>

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

export default Plans;
