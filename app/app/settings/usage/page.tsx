"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { userInfoAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";
import { format } from "date-fns";

interface CreditLog {
  created_at: string;
  count: number;
  action: string;
}

const mockCreditLogs: CreditLog[] = Array.from({ length: 20 }, (_, index) => ({
  created_at: new Date().toISOString(),
  // count: Math.floor(Math.random() * 100),
  count: 1,
  action:
    Math.floor(Math.random() * 100) % 2 === 0
      ? "generate opportunities"
      : "generate summary",
}));

const Usage = () => {
  const [creditLogs, setCreditLogs] = useState<CreditLog[]>(mockCreditLogs);
  const userInfo = useAtomValue(userInfoAtom);

  useEffect(() => {
    if (!userInfo) return;

    const fetchCreditLogs = async () => {
      const { data, error } = await supabase
        .from("credit_logs")
        .select("created_at, count, action")
        .eq("user_id", userInfo.id);

      if (error) {
        console.error("Error fetching credit logs:", error);
      } else {
        setCreditLogs(data as CreditLog[]);
      }
    };

    // fetchCreditLogs();
  }, [userInfo]);

  return (
    <div className="container max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Usage</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Action</th>
            <th className="py-2 px-4 border-b">Count</th>
            <th className="py-2 px-4 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {creditLogs.map((log) => (
            <tr key={log.created_at} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{log.action}</td>
              <td className="py-2 px-4 border-b">{log.count}</td>
              <td className="py-2 px-4 border-b">
                {format(new Date(log.created_at), "PPpp")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usage;
