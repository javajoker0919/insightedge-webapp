"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "./userContext";
import { supabase } from "@/utils/supabaseClient";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useUserContext();

  useEffect(() => {
    if (window.location.href.includes("localhost:")) return;

    const checkAuth = async () => {
      if (userInfo) {
        await authCheck(true);
      } else if (userInfo === null) {
        await authCheck(false);
      }
    };

    checkAuth();
  }, [pathname, userInfo]);

  const authCheck = async (isAuth: boolean) => {
    if (isAuth) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("auth_completed")
          .eq("id", userInfo.id)
          .single();

        if (error) throw error;

        if (!data.auth_completed && pathname !== "/auth/create-profile") {
          router.push("/auth/create-profile");
        }
      } catch (error) {
        console.error("Error fetching auth_completed status:", error);
      }
    } else {
      // Handle non-authenticated user logic here if needed
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="text-black">Loading...</div>; // Or any loading component
  }

  return children;
};

export default AuthProvider;
