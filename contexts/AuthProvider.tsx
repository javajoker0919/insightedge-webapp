"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import {
  userMetadataAtom,
  profileAtom,
  userInfoAtom,
  orgInfoAtom,
  watchlistAtom,
} from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();

  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setProfile = useSetAtom(profileAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchlist = useSetAtom(watchlistAtom);

  const [isLoading, setIsLoading] = useState(true);

  const authPaths = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/auth/reset-password",
    "/auth/reset-confirm",
    "/auth/reset-success",
    "/landing",
    "/landing/app",
    "/terms",
    "/privacy",
  ];
  const landingPath = "/";

  useEffect(() => {
    checkUser();
    const intervalId = setInterval(checkUser, 60000); // Check every 60 seconds

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
      authListener.subscription.unsubscribe();
    };
  }, [pathname, userInfo]); // Effect depends on pathname changes

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserMetadata(session.user.user_metadata);
      } else {
        setUserMetadata(null);
        setProfile(null);
        setWatchlist(null);

        setUserInfo(null);
        setOrgInfo(null);

        if (!authPaths.includes(pathname) && pathname !== landingPath) {
          router.push("/auth/sign-in");
        }
      }
    } catch (error) {
      console.error("Failed to verify user session:", error);
    } finally {
      // Mark loading as complete
      setIsLoading(false);
    }
  };

  // Display loading indicator while authentication status is being checked
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
      </div>
    );
  }

  // Render child components after authentication check is complete
  return children;
};

export default AuthProvider;
