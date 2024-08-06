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

const Plans = () => {
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
      router.replace("/app/settings/plans");
    }
  }, [searchParams, router, userInfo]);

  if (isLoading) {
    return (
      <div className="m-auto">
        <span className="ml-2 inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

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
            {currentPlan === "free" && (
              <p className="w-full py-2 px-4 border border-gray-300 bg-gray-400 rounded-md text-white">
                Current Plan
              </p>
            )}
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
              className={`w-full py-2 px-4 border border-gray-300 bg-primary-500 disabled:bg-gray-400 rounded-md text-white disabled:cursor-not-allowed`}
              onClick={() =>
                handleSubscribe(
                  currentPlan === "standard" ? "standard" : "free"
                )
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              ) : "STANDARD" == currentPlan?.toUpperCase() ? (
                "Check Subscription"
              ) : (
                "Subscribe"
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
