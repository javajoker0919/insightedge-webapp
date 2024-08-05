"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { createCheckoutSession } from "@/utils/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { useToastContext } from "@/contexts/toastContext";
import { userInfoAtom, watchlistAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

interface PlanItemProps {
  children: React.ReactNode;
  isAvailable: boolean;
}

const MembershipItem: React.FC<PlanItemProps> = ({ children, isAvailable }) => (
  <li className="mb-4 flex items-center justify-start gap-3">
    {isAvailable ? (
      <FaCheckCircle className="text-green-500 text-lg" />
    ) : (
      <FaTimesCircle className="text-red-500 text-lg" />
    )}
    <span className="text-gray-700">{children}</span>
  </li>
);

const freePlanItems: { text: React.ReactNode; isAvailable: boolean }[] = [
  { text: "General AI insights", isAvailable: true },
  { text: "General AI recommendations", isAvailable: true },
  { text: "Personalized AI insights", isAvailable: true },
  { text: "Personalized sales opportunity", isAvailable: true },
  { text: "Email newsletters", isAvailable: false },
  { text: "Prospect recommendations (up to 10)", isAvailable: true },
  { text: "AI credits (10)", isAvailable: true },
  { text: "Additional AI credits", isAvailable: false },
];

const standardPlanItems: {
  text: React.ReactNode;
  isAvailable: boolean;
}[] = [
  { text: "General AI insights", isAvailable: true },
  { text: "General AI recommendations", isAvailable: true },
  { text: "Personalized AI insights", isAvailable: true },
  { text: "Personalized sales opportunity", isAvailable: true },
  { text: "Email newsletters", isAvailable: false },
  { text: "Prospect recommendations (up to 20)", isAvailable: true },
  { text: "AI credits (20)", isAvailable: true },
  { text: "Additional AI credits ($x/ 10 credits)", isAvailable: true },
];

const Membership: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { invokeToast } = useToastContext();
  const userInfo = useAtomValue(userInfoAtom);
  const watchlist = useAtomValue(watchlistAtom);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [orderHistory, setOrderHistory] = useState<
    Array<{
      order_number: number;
      plan_name: string;
      created_at: string;
    }>
  >([]);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      if (userInfo) {
        const { data: userPlans, error: userPlanError } = await supabase
          .from("user_plans")
          .select("id, plan_id, created_at")
          .eq("user_id", userInfo.id)
          .order("created_at", { ascending: false });

        if (userPlanError) {
          console.error("Error fetching user plans:", userPlanError);
          return;
        }

        if (userPlans && userPlans.length > 0) {
          const { data: plan, error: planError } = await supabase
            .from("plans")
            .select("name")
            .eq("id", userPlans[0].plan_id)
            .single();

          if (planError) {
            console.error("Error fetching plan:", planError);
            return;
          }

          setCurrentPlan(plan.name.toUpperCase());

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

    fetchCurrentPlan();
  }, [userInfo]);

  const planItems =
    currentPlan === "STANDARD" ? standardPlanItems : freePlanItems;

  const handleUpgradePlanClick = () => {
    setIsButtonLoading(true);
    router.push("/subscription");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center m-auto items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="m-auto px-4 py-8 pb-20">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full min-w-96">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white text-center">
                Your Current Plan Features
              </h2>
            </div>
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {planItems.map((item, index) => (
                  <MembershipItem key={index} isAvailable={item.isAvailable}>
                    {item.text}
                  </MembershipItem>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <p className="text-sm text-gray-600">
                Current Plan:{" "}
                <span className="font-semibold">{currentPlan || "Free"}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full min-w-[30rem]">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-200 px-6 py-4">
              <h2 className="text-2xl text-gray-600 text-center">
                Plan History
              </h2>
            </div>
            <div className="px-6 py-8">
              <table className="w-full text-center">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-gray-600 font-semibold">NO</th>
                    <th className="pb-2 text-gray-600 font-semibold">Plan</th>
                    <th className="pb-2 text-gray-600 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr
                      key={order.order_number}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-2 text-gray-700">
                        {order.order_number}
                      </td>
                      <td className="py-2 text-gray-700">
                        {order.plan_name.toUpperCase()}
                      </td>
                      <td className="py-2 text-gray-700">{order.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center">
        {currentPlan === "STANDARD" ? (
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/subscription")}
          >
            Check Plan
          </button>
        ) : (
          <button
            className="bg-primary-500 hover:bg-primary-600 w-40 text-white font-bold py-2 px-4 rounded"
            onClick={handleUpgradePlanClick}
          >
            {isButtonLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
            ) : (
              <span>Upgrade Plan</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Membership;
