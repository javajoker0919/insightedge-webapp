"use client";
import React, { useEffect, useState } from "react";
import {
  cancelSubscription,
  updatePlan,
  customerPortal,
  stopCancelSubscription,
} from "@/utils/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { userInfoAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";
import { FaArrowRight } from "react-icons/fa";
import Loading from "@/app/components/Loading";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useToastContext } from "@/contexts/toastContext";

interface OrderHistory {
  order_number: number;
  plan_name: string;
  created_at: string;
}

const Membership: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const userInfo = useAtomValue(userInfoAtom);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState<boolean>(false);
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);
  const [isStopCancelLoading, setIsStopCancelLoading] =
    useState<boolean>(false);
  const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);
  const { invokeToast } = useToastContext();

  const freePlanItems = [
    "General AI insights",
    "General AI recommendations",
    "Personalized AI insights",
    "Personalized sales opportunities",
  ];

  const plusPlanItems = [
    "Email newsletters",
    "Additional AI credits ($x / 10 credits)",
  ];

  useEffect(() => {
    if (status === "success") {
      invokeToast("success", "Subscription has been successful", "top");
      router.push("/app/settings/billing");
    } else if (status === "canceled") {
      invokeToast("error", "Something went wrong", "top");
      router.push("/app/settings/billing");
    }
  }, [status, router]);

  useEffect(() => {
    fetchCurrentPlan();
  }, [userInfo]);

  const fetchCurrentPlan = async () => {
    if (userInfo) {
      setIsLoading(true);

      const { data: userPlans, error: userPlanError } = await supabase
        .from("user_plans")
        .select("id, plan_id, created_at, end_date")
        .eq("user_id", userInfo.id)
        .order("created_at", { ascending: false });

      if (userPlanError) {
        console.error("Error fetching user plans:", userPlanError);
        return;
      }

      if (userPlans && userPlans.length > 0) {
        const { data: plan, error: planError } = await supabase
          .from("plans")
          .select("name, price")
          .eq("id", userPlans[0].plan_id)
          .single();

        if (planError) {
          console.error("Error fetching plan:", planError);
          return;
        }

        setCurrentPlan(plan.name);
        setCurrentPrice(plan.price);
        setEndDate(userPlans[0].end_date);

        const history = await Promise.all(
          userPlans.map(async (userPlan, index) => {
            const { data: planData } = await supabase
              .from("plans")
              .select("name")
              .eq("id", userPlan.plan_id)
              .single();

            return {
              order_number: userPlans.length - index,
              plan_name: planData?.name || "Unknown",
              created_at: format(new Date(userPlan.created_at), "yyyy-MM-dd"),
            };
          })
        );

        setOrderHistory(history);
      }

      setIsLoading(false);
    }
  };

  const handleUpgradePlan = async () => {
    setIsUpgradeLoading(true);
    try {
      const response = await updatePlan("standard");
      router.push(response.url);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpgradeLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelLoading(true);
    try {
      const response = await cancelSubscription();
      console.log(response);
      if (response.status === "success") {
        invokeToast("success", response.message, "top");
        setTimeout(() => {
          fetchCurrentPlan();
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCancelLoading(false);
    }
  };

  const handleStopCancelSubscription = async () => {
    setIsStopCancelLoading(true);
    try {
      const response = await stopCancelSubscription();
      console.log(response);
      if (response.status === "success") {
        invokeToast("success", response.message, "top");
        setTimeout(() => {
          fetchCurrentPlan();
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsStopCancelLoading(false);
    }
  };

  const handleCheckSubscription = async () => {
    setIsCheckLoading(true);
    try {
      const response = await customerPortal();
      router.push(response.url);
    } catch (error) {
      console.error("Error creating customer portal:", error);
      toast.error("Failed to create customer portal. Please try again.");
    } finally {
      setIsCheckLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center m-auto items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="px-4 max-w-2xl w-full py-8 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div className="text-3xl">Subscription Details</div>

          {userInfo?.creditCount && (
            <div className="flex justify-center font-semibold text-lg text-primary-500">
              <p>{`Credits: ${userInfo.creditCount}`}</p>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-lg mb-20">
          <div className="flex flex-col bg-gray-500 border bg-opacity-10 w-full mb-12 justify-center rounded-lg">
            <p className="text-gray-700 text-xl text-center w-full p-6 bg-gray-300">
              {`You are on `}
              <span className="px-2 py-1 rounded-md font-medium text-primary-600">
                {currentPlan?.toUpperCase()}
              </span>
              {` plan for `}
              <span className="text-black font-medium">
                ${currentPrice} per month
              </span>
            </p>

            <div className="flex flex-col mx-auto space-y-2 p-4">
              {currentPlan === "standard" && (
                <div className="space-y-2">
                  <p className="font-semibold">Everything in Free, plus...</p>
                  {plusPlanItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              )}

              {currentPlan === "free" && (
                <div>
                  {freePlanItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
                <p className="text-gray-600">{`Prospect recommendations (up to ${
                  currentPlan === "free" ? 10 : 20
                })`}</p>
              </div>

              <div className="flex items-center gap-2">
                <IoCheckmarkCircleOutline className="text-green-500 text-xl" />
                <p className="text-gray-600">{`AI credits (${
                  currentPlan === "free" ? 10 : 20
                })`}</p>
              </div>
            </div>
          </div>

          {endDate && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Notice: </strong>
              <span className="block sm:inline">
                {`Your subscription will be cancelled on `}
                <span className="font-bold">
                  {format(new Date(endDate), "yyyy-MM-dd")}
                </span>
                {`.`}
              </span>
            </div>
          )}

          <div className="flex w-full justify-center gap-4 items-center mt-8">
            {currentPlan === "free" ? (
              <button
                onClick={handleUpgradePlan}
                className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded"
                disabled={isUpgradeLoading}
              >
                {isUpgradeLoading ? <Loading size={6} /> : "Upgrade Plan"}
              </button>
            ) : (
              <div className="flex justify-center items-center gap-4">
                {endDate ? (
                  <button
                    onClick={handleStopCancelSubscription}
                    className="hover:bg-primary-600 w-32 justify-center disabled:cursor-not-allowed text-white bg-primary-500 flex items-center gap-1 font-bold py-2 px-4 rounded"
                    disabled={isStopCancelLoading || isCheckLoading}
                  >
                    {isStopCancelLoading ? (
                      <Loading size={6} color={`white`} />
                    ) : (
                      "Renew Plan"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleCancelSubscription}
                    className="hover:bg-primary-600 w-32 justify-center disabled:cursor-not-allowed text-white bg-primary-500 flex items-center gap-1 font-bold py-2 px-4 rounded"
                    disabled={isCancelLoading || isCheckLoading}
                  >
                    {isCancelLoading ? (
                      <Loading size={6} color={`white`} />
                    ) : (
                      "Cancel Plan"
                    )}
                  </button>
                )}

                <button
                  onClick={handleCheckSubscription}
                  className={`hover:bg-primary-50 w-52 justify-center disabled:cursor-not-allowed ${
                    isCheckLoading ? "bg-primary-50" : ""
                  } text-primary-500 flex items-center gap-1 font-bold py-2 px-4 rounded`}
                  disabled={
                    isCheckLoading || isStopCancelLoading !== isCancelLoading
                  }
                >
                  {isCheckLoading ? (
                    <Loading size={6} />
                  ) : (
                    <div className="flex items-center gap-1">
                      <span>Check Subscription</span>
                      <FaArrowRight />
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
