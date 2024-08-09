"use client";

import { useState } from "react";
import { orgInfoAtom, userInfoAtom, watchlistAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const CompanyProfile = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchList = useSetAtom(watchlistAtom);
  const [website, setWebsite] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [productsServices, setProductsServices] = useState("");

  const handleCreateCompanyProfile = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error("User data not found");

      const insertOrganizationData = {
        name: userInfo?.companyName || "",
        website,
        overview: companyOverview,
        products: productsServices,
        creator_id: userData.id
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
        creatorID: userData.id
      });

      const insertWatchlistData = {
        name: "Watchlist",
        organization_id: orgData.id,
        creator_id: userData.id
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
          uuid: watchlistData.uuid
        }
      ]);
      router.replace("/onboarding/user-awareness");
    } catch (error) {
      console.error("Error creating company profile:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col items-center justify-center w-1/2 h-full">
        <div className="flex items-center absolute top-6 left-6">
          <Image
            src="/favicon.png"
            alt="ProspectEdge Logo"
            width={40}
            height={40}
          />
          <Image src="/logo.png" alt="ProspectEdge" width={200} height={40} />
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col items-center max-w-[500px] w-full">
            <div className="flex flex-col justify-center text-lg leading-7 w-full mb-6">
              <label htmlFor="website" className="font-bold text-gray-800 mb-2">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="font-normal border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <button className="text-base font-medium leading-7 text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-6 py-3 rounded-md shadow-sm w-fit mt-8">
              Summarize Company Using AI
            </button>
            <p className="text-sm font-normal leading-5 text-gray-500 mt-2">
              (Recommended)
            </p>
            <div className="flex flex-col w-full text-sm font-normal leading-6 text-gray-600 text-center mt-12">
              <p className="mb-2">Our AI will scan your website to create:</p>
              <ul className="list-disc list-inside mb-4">
                <li>A brief company profile</li>
                <li>A list of your products and services</li>
              </ul>
              <p>
                This helps us customize your experience and tailor summaries,
                sales opportunities, and marketing strategies based on your
                company.
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-10 w-full px-32">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              onClick={() => router.push("/onboarding/user-info")}
            >
              <GoArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              onClick={handleCreateCompanyProfile}
            >
              Continue
              <GoArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex bg-gray-50 w-1/2 px-16 items-center justify-center h-full">
        <div className="flex flex-col gap-10 w-full">
          <div className="flex flex-col gap-8">
            <p className="text-sm leading-5 font-normal text-[#171A1FFF]">
              Company Profile
            </p>
            <textarea
              className="text-sm leading-6 font-normal text-[#171A1FFF] w-full border border-[#BDC1CAFF] rounded-sm outline-none px-4 py-3"
              rows={8}
              value={companyOverview}
              onChange={(e) => setCompanyOverview(e.target.value)}
            ></textarea>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-sm leading-5 font-normal text-[#171A1FFF]">
              Products & Services
            </p>
            <textarea
              className="text-sm leading-6 font-normal text-[#171A1FFF] w-full border border-[#BDC1CAFF] rounded-sm outline-none px-4 py-3"
              rows={8}
              value={productsServices}
              onChange={(e) => setProductsServices(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
