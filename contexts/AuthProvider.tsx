"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { userMetadataAtom, userDataAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";

// AuthProvider component manages user authentication state and handles routing based on auth status
const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useAtom(userMetadataAtom);
  const [userData, setUserData] = useAtom(userDataAtom);

  // Define paths that don't require authentication
  const authPaths = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"];
  const landingPath = "/";

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select(
            `
            id,
            email,
            first_name,
            last_name,
            company_name,
            website,
            company_overview,
            has_company_profile,
            products_and_services,
            auth_step_completed
            `
          )
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error occurred while fetching profile:", error);
          throw error;
        }

        setUserData({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          companyName: data.company_name,
          website: data.website,
          companyOverview: data.company_overview,
          hasCompanyProfile: data.has_company_profile,
          productsAndServices: data.products_and_services,
          authStepCompleted: data.auth_step_completed,
        });
      }
    };

    fetchUserData();
  }, []);

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

          // Check if authStepCompleted is 0 and redirect if necessary
          if (userData) {
            if (userData.authStepCompleted === 0) {
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
  }, [pathname, userData]); // Effect depends on pathname changes

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
