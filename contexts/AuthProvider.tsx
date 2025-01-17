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
import { Loading } from "@/app/components";
import { getMixPanelClient } from "@/utils/mixpanel";

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const mixpanel = getMixPanelClient();

  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setProfile = useSetAtom(profileAtom);
  const setWatchlist = useSetAtom(watchlistAtom);

  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);

  const [isLoading, setIsLoading] = useState(true);

  const authPaths = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/verify-email",
    "/auth/reset-password",
    "/auth/reset-confirm",
    "/auth/reset-success",
  ];

  const publicPaths = ["/", "/terms", "/privacy", "/features", "/pricing"];
  const blogPath = "/blog";

  useEffect(() => {
    checkUser();

    const intervalId = setInterval(checkUser, 60000); // Check every 60 seconds

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    mixpanel.track("page_view", {
      $destination: pathname,
    });

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
      authListener.subscription.unsubscribe();
    };
  }, [pathname]); // Effect depends on pathname changes

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserMetadata(session.user.user_metadata);

        if (authPaths.some((path) => pathname.startsWith(path))) {
          router.push("/app");
        }
      } else {
        setUserMetadata(null);
        setProfile(null);
        setWatchlist(null);
        setOrgInfo(null);

        if (
          publicPaths.includes(pathname) ||
          authPaths.includes(pathname) ||
          pathname.startsWith(blogPath)
        ) {
          return;
        }

        router.push("/auth/sign-in");
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
        <Loading />
      </div>
    );
  }

  // Render child components after authentication check is complete
  return children;
};

export default AuthProvider;
