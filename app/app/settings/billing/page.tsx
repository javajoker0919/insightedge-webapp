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
import { Router } from "next/router";

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
  const [selectedTab, setSelectedTab] = useState<string>("features");

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

          setCurrentPlan(plan.name);

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
    currentPlan === "standard" ? standardPlanItems : freePlanItems;

  if (isLoading) {
    return (
      <div className="flex justify-center m-auto items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="px-4 max-w-2xl w-full py-8 pb-20">
        <div className="text-3xl mb-10">Subscription Details</div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-600">
            {`You are on `}
            <span className="px-2 py-1 rounded-md bg-primary-50 font-medium text-primary-600">
              {currentPlan?.toUpperCase()}
            </span>
            {` plan for `}
            <span className="text-black font-medium">$99 per month</span>
          </p>

          <div className="text-center">
            {currentPlan !== "free" && (
              <button
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => router.push("/subscription")}
              >
                Check Subscription
              </button>
            )}
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="flex border-b justify-center space-x-4">
            <button
              className={`p-4 w-full ${
                selectedTab === "features" ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedTab("features")}
            >
              Features
            </button>
            <button
              className={`p-4 w-full ${
                selectedTab === "history" ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedTab("history")}
            >
              History
            </button>
          </div>

          <div className="h-[30rem] overflow-auto">
            {selectedTab === "features" ? (
              <div className="flex flex-col m-auto h-full w-fit md:flex-row gap-8">
                <div className="w-full flex flex-col justify-around h-full items-center">
                  <ul className="space-y-4">
                    {planItems.map((item, index) => (
                      <MembershipItem
                        key={index}
                        isAvailable={item.isAvailable}
                      >
                        {item.text}
                      </MembershipItem>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      router.push("/app/settings/plans");
                    }}
                    className="rounded bg-primary-500 px-4 py-2 text-white"
                  >
                    Upgrade / Downgrade Plan
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full min-w-[30rem]">
                <div className="px-6 py-8">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 text-gray-600 font-semibold">NO</th>
                        <th className="pb-2 text-gray-600 font-semibold">
                          Plan
                        </th>
                        <th className="pb-2 text-gray-600 font-semibold">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order) => (
                        <tr
                          key={order.order_number}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-2 text-gray-700">
                            {order.order_number}
                          </td>
                          <td className="py-2 text-gray-700">
                            {order.plan_name.toUpperCase()}
                          </td>
                          <td className="py-2 text-gray-700">
                            {order.created_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
