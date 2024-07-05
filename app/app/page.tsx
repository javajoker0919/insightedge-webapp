"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useAtom } from "jotai";
import { userMetadataAtom } from "@/utils/atoms";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [userMetadata, setUserMetadata] = useAtom(userMetadataAtom);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUserMetadata(null);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container text-black mx-auto flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">
        Welcome to your dashboard, {userMetadata?.name || "User"}.
      </p>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isLoading ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}
