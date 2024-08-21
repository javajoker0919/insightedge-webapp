"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { orgInfoAtom, userInfoAtom, watchlistAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";
import Image from "next/image";

import { Loading } from "../..";
import { supabase } from "@/utils/supabaseClient";
import { createCustomer } from "@/utils/apiClient";
import OnboardCompanySearchbar from "./OnboardCompanySearchbar";
import OnboardSimilarCompanySection from "./OnboardSimilarCompanySection";

export interface CompanyProps {
  id: number;
  industry: string;
  name: string;
  symbol: string;
}

const OnboardingInitialCompanySection = ({
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

  const [companies, setCompanies] = useState<CompanyProps[]>([]);

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

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="w-1/2 flex items-center justify-center h-full">
        <div className="w-full flex max-w-[40rem] relative justify-center">
          <OnboardCompanySearchbar
            isSearchBarOpen={false}
            setIsSearchBarOpen={() => {}}
            setWatchlistCompanies={() => {}}
            companies={companies}
            setCompanies={setCompanies}
          />

          <div className="border rounded mt-16 h-96 w-full overflow-y-auto divide-y">
            {companies.map((company, index) => {
              return (
                <div
                  key={`company-${company.id}-${index}`}
                  className={`py-2 px-5 bg-white transition-colors duration-200 flex justify-between items-center`}
                >
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-gray-500 text-sm">{company.symbol}</p>
                  </div>
                  <p className="text-gray-500 text-sm rounded-full py-1 px-3 bg-yellow-50 border-yellow-200 border">
                    {company.industry}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex bg-gray-50 w-1/2 items-center justify-center h-full">
        <OnboardSimilarCompanySection
          companies={companies}
          setCompanies={setCompanies}
        />
      </div>
    </div>
  );
};

export default OnboardingInitialCompanySection;
