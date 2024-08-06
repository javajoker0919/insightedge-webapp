"use client";
import React, { useEffect, useState } from "react";
import { customerPortal } from "@/utils/apiClient";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { userInfoAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";
import { FaArrowRight } from "react-icons/fa";

const Membership: React.FC = () => {
  const router = useRouter();
  const userInfo = useAtomValue(userInfoAtom);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
            .select("name, price")
            .eq("id", userPlans[0].plan_id)
            .single();

          if (planError) {
            console.error("Error fetching plan:", planError);
            return;
          }

          setCurrentPlan(plan.name);
          setCurrentPrice(plan.price);

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

  const handleCheckSubscription = async () => {
    try {
      const response = await customerPortal();
      router.push(response.url);
    } catch (error) {
      console.error("Error creating customer portal:", error);
      toast.error("Failed to create customer portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="bg-gray-500 bg-opacity-0 rounded-lg mb-20">
          <div className="flex items-center bg-gray-500 bg-opacity-10 p-6 w-full mb-12 justify-center rounded-lg">
            <p className="text-gray-600 text-xl text-center">
              {`You are on `}
              <span className="px-2 py-1 rounded-md font-medium text-primary-600">
                {currentPlan?.toUpperCase()}
              </span>
              {` plan for `}
              <span className="text-black font-medium">
                ${currentPrice} per month
              </span>
            </p>
          </div>

          <div className="flex w-full justify-center gap-4 items-center">
            <button
              onClick={() => {
                router.push("/app/settings/plans");
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded"
            >
              Upgrade / Downgrade Plan
            </button>

            {currentPlan !== "free" && (
              <button
                onClick={handleCheckSubscription}
                className="hover:bg-primary-50 text-primary-500 flex items-center gap-1 font-bold py-2 px-4 rounded"
              >
                Check Subscription
                <FaArrowRight />
              </button>
            )}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="h-[25rem] overflow-auto">
            <div className="w-full min-w-[30rem]">
              <div className="w-full p-4 bg-gray-200">
                <p className="text-center text-xl text-gray-600">
                  Plan History
                </p>
              </div>
              <div className="p-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;