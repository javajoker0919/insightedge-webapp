"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { userMetadataAtom, userInfoAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

// AuthProvider component manages user authentication state and handles routing based on auth status
const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useAtom(userMetadataAtom);
  const userInfo = useAtomValue(userInfoAtom);

  // Define paths that don't require authentication
  const authPaths = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/subscription",
  ];
  const landingPath = "/";

  useEffect(() => {
    // Asynchronous function to verify user authentication status
    const checkUser = async () => {
      try {
        // Retrieve the current session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // If a valid session exists, update the user metadata
          setUserMetadata(session.user.user_metadata);

          // Check if onboardingStatus is true and redirect if necessary
          if (userInfo) {
            if (
              !userInfo.onboardingStatus &&
              !authPaths.includes(pathname) &&
              pathname !== landingPath
            ) {
              router.push("/auth/create-profile");
            }
          }
        } else {
          // Clear user metadata if no valid session
          setUserMetadata(null);
          if (
            // Redirect to sign-in if user is not authenticated and not on exempt pages
            !userMetadata &&
            !authPaths.includes(pathname) &&
            pathname !== landingPath
          ) {
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
