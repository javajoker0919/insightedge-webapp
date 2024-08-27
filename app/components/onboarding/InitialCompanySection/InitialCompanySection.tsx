"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { Loading } from "../..";
import { supabase } from "@/utils/supabaseClient";
import {
  orgInfoAtom,
  userInfoAtom,
  profileAtom,
  watchlistAtom,
} from "@/utils/atoms";
import { createCustomer } from "@/utils/apiClient";
import OnboardCompanySearchbar from "./OnboardCompanySearchbar";
import OnboardSimilarCompanySection from "./OnboardSimilarCompanySection";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { IoClose } from "react-icons/io5";

export interface CompanyProps {
  id: number;
  name: string;
  symbol: string;
  industry: string;
}

const OnboardingInitialCompanySection = ({
  formData,
  website,
  companyOverview,
  productsServices,
  setOnboardingStep,
  symbols,
}: {
  formData: any;
  website: any;
  companyOverview: any;
  productsServices: any;
  setOnboardingStep: any;
  symbols: string[];
}) => {
  const router = useRouter();
  const setProfile = useSetAtom(profileAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchList = useSetAtom(watchlistAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [isLoading, setIsLoading] = useState(false);

  const [companies, setCompanies] = useState<CompanyProps[]>([]);

  const randomColor = [
    "bg-fuchsia-800",
    "bg-teal-800",
    "bg-gray-800",
    "bg-red-800",
    "bg-blue-800",
    "bg-green-800",
    "bg-purple-800",
  ];

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

      setProfile({
        user_id: userData.id,
        org_id: orgData.id,
        credits: null,
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

      const companyIDs = companies.map((company) => company.id);

      const { data: watchlistCompanies, error: watchlistCompanyError } =
        await supabase.from("watchlist_companies").insert(
          companyIDs.map((companyId) => ({
            watchlist_id: watchlistData.id,
            company_id: companyId,
          }))
        );

      if (watchlistCompanyError) throw watchlistCompanyError;
      router.replace(`/app/watchlist/${watchlistData.uuid}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCompany = (companyId: number) => {
    setCompanies((prevCompanies) =>
      prevCompanies.filter((company) => company.id !== companyId)
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="w-1/2 flex items-center justify-center h-full px-4">
        <div className="w-full flex max-w-[40rem] relative justify-center">
          <OnboardCompanySearchbar
            isSearchBarOpen={false}
            setIsSearchBarOpen={() => {}}
            setWatchlistCompanies={() => {}}
            companies={companies}
            setCompanies={setCompanies}
          />

          <div className="flex flex-col w-full">
            <div className="border rounded mt-16 h-96 w-full overflow-y-auto divide-y">
              {companies.map((company, index) => {
                return (
                  <div
                    key={`company-${company.id}-${index}`}
                    className="hover:bg-gray-50 px-2 py-1 flex items-center gap-1 justify-between"
                  >
                    <div className="space-y-2 w-full p-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm text-white py-0.5 px-1 ${
                            randomColor[
                              Math.floor(Math.random() * randomColor.length)
                            ]
                          }`}
                        >
                          {company.symbol}
                        </p>
                        <h4 className="font-semibold text-gray-700">
                          {company.name}
                        </h4>
                      </div>

                      <p className="text-gray-600 border rounded-full w-fit border-yellow-500 bg-yellow-50 text-sm py-0.5 px-2">
                        {company.industry}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveCompany(company.id)}
                      className="p-4 hover:bg-gray-200 rounded-full"
                    >
                      <IoClose className="w-6 h-6" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-10 w-full">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setOnboardingStep(1)}
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleCreateProfile}
              >
                Dashboard
                <GoArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex bg-gray-50 w-1/2 items-center justify-center h-full">
        <OnboardSimilarCompanySection
          symbols={symbols}
          companies={companies}
          setCompanies={setCompanies}
        />
      </div>
    </div>
  );
};

export default OnboardingInitialCompanySection;
