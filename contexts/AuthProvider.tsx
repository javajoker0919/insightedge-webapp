"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import {
  userMetadataAtom,
  userInfoAtom,
  orgInfoAtom,
  watchlistAtom,
} from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useAtom(userMetadataAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [orgInfo, setOrgInfo] = useAtom(orgInfoAtom);
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);

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
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUserMetadata(session.user.user_metadata);
        } else {
          setUserMetadata(null);
          setUserInfo(null);
          setOrgInfo(null);
          setWatchlist(null);

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

    checkUser();
    const intervalId = setInterval(checkUser, 60000); // Check every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [pathname, userInfo]); // Effect depends on pathname changes

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
