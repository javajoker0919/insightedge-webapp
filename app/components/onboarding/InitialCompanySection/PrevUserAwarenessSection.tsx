"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orgInfoAtom, userInfoAtom, watchlistAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

import { Loading } from "../..";
import { supabase } from "@/utils/supabaseClient";
import { createCustomer } from "@/utils/apiClient";

const UserAwareness = ({
  formData,
  website,
  companyOverview,
  productsServices,
  setOnboardingStep,
}: {
  formData: any;
  website: any;
  companyOverview: any;
  productsServices: any;
  setOnboardingStep: any;
}) => {
  const router = useRouter();
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchList = useSetAtom(watchlistAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      setIsLoading(true);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: user.id,
          email: user.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          onboarding_status: true,
        })
        .select()
        .single();

      if (userError) throw userError;

      createCustomer();

      setUserInfo({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        companyName: formData.companyName,
      });

      const insertOrganizationData = {
        name: formData.companyName || "",
        website: website,
        overview: companyOverview,
        products: productsServices,
        creator_id: userData.id,
      };

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert(insertOrganizationData)
        .select()
        .single();

      if (orgError) throw orgError;

      setOrgInfo({
        id: orgData.id,
        name: orgData.name,
        website: orgData.website,
        overview: orgData.overview,
        products: orgData.products,
        creatorID: userData.id,
      });

      const insertWatchlistData = {
        name: "Watchlist",
        organization_id: orgData.id,
        creator_id: userData.id,
      };

      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlists")
        .insert(insertWatchlistData)
        .select()
        .single();

      if (watchlistError) throw watchlistError;

      setWatchList([
        {
          id: watchlistData.id,
          name: watchlistData.name,
          organizationID: watchlistData.organization_id,
          creatorID: watchlistData.creator_id,
          uuid: watchlistData.uuid,
        },
      ]);
      router.replace(`/app/watchlist/${watchlistData.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-row w-full h-screen">
          <div className="flex flex-col items-center justify-center w-1/2 h-full">
            <div className="flex flex-col w-full px-16">
              <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8">
                How did you hear about ProspectEdge?
              </h1>
              <form className="space-y-4">
                {[
                  "Search engines (Google, Safari, Bing, etc.)",
                  "Social media (Facebook, Instagram, X, TikTok, etc.)",
                  "Podcast or radio",
                  "Streaming platforms (YouTube, Twitch, etc.)",
                  "Email",
                  "Word of mouth",
                ].map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`checkbox-${index}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`checkbox-${index}`}
                      className="ml-2 text-lg font-medium text-gray-900"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </form>
              <div className="flex justify-between mt-8">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setOnboardingStep(1)}
                >
                  <GoArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={handleCreateProfile}
                >
                  {isLoading ? (
                    <span className="flex justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      {" "}
                      Dashboard
                      <GoArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex bg-gray-50 w-1/2 items-center justify-center h-full">
            <div className="relative">
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-[50%] w-[365px] h-[59px] bg-[#EAECF0] z-0"
                aria-hidden="true"
              ></div>
              <Image
                alt="User Awareness Illustration"
                src="/icons/user-awareness.svg"
                width={454}
                height={451}
                className="relative z-10"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
};

export default UserAwareness;
