"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { userInfoAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";
import { format } from "date-fns";

import Loading from "@/app/components/Loading";
import { useToastContext } from "@/contexts/toastContext";

interface CreditLog {
  created_at: string;
  count: number;
  action: string;
  used_credits: number;
  remained_credits: number;
}

const Usage = () => {
  const { invokeToast } = useToastContext();
  const userInfo = useAtomValue(userInfoAtom);

  const [creditLogs, setCreditLogs] = useState<CreditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchCreditLogs();
    }
  }, [userInfo]);

  const fetchCreditLogs = async () => {
    if (userInfo === null || userInfo.id === null) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("credit_logs")
        .select("created_at, count, action, used_credits, remained_credits")
        .eq("user_id", userInfo.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching credit logs:", error);
        throw error;
      } else if (data) {
        setCreditLogs(data as CreditLog[]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      invokeToast("error", `Failed to fetch credit logs: ${error}`);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-8">
      <div className="flex items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Usage</h1>
        <span>{`(Remaning credits: ${userInfo?.creditCount})`}</span>
      </div>
      {isLoading ? (
        <div className="flex justify-center m-auto items-center">
          <Loading />
        </div>
      ) : creditLogs.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Used Credits</th>
              <th className="py-2 px-4 border-b">Remained Credits</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {creditLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{log.action}</td>
                <td className="py-2 px-4 border-b">{log.used_credits}</td>
                <td className="py-2 px-4 border-b">{log.remained_credits}</td>
                <td className="py-2 px-4 border-b">
                  {format(new Date(log.created_at), "PPpp")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">There is no usage.</p>
      )}
    </div>
  );
};

export default Usage;
