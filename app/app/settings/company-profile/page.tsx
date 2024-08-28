"use client";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { orgInfoAtom } from "@/utils/atoms";
import { Loading } from "@/app/components";
import { useToastContext } from "@/contexts/toastContext";
import { getScrapeData } from "@/utils/apiClient";

const CompanyProfile = () => {
  const [orgInfo, setOrgInfo] = useAtom(orgInfoAtom);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [overview, setOverview] = useState("");
  const [products, setProducts] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { invokeToast } = useToastContext();

  useEffect(() => {
    if (orgInfo) {
      setName(orgInfo.name || "");
      setWebsite(orgInfo.website || "");
      setOverview(orgInfo.overview || "");
      setProducts(orgInfo.products || "");
    }
  }, [orgInfo]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("organizations")
      .update({
        name,
        website,
        overview,
        products,
      })
      .eq("id", orgInfo?.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      invokeToast("success", "Profile updated successfully");
      setOrgInfo((prev) => ({
        ...prev,
        name,
        website,
        overview,
        products,
        id: prev?.id || 0, // Ensure id is always a number
        creatorID: prev?.creatorID || "", // Ensure creatorID is always a string
      }));
    }
    setIsUpdating(false);
  };

  const SummarizeAI = async () => {
    try {
      setIsSummarizing(true);

      const reqData = {
        company_url: website,
        company_name: name
      };

      const data = await getScrapeData(reqData);

      setOverview(data.data.overview);
      setProducts(data.data.products);

      invokeToast("success", "AI summarization completed successfully");
    } catch (error) {
      console.error("Error scraping company data:", error);
      invokeToast("error", "Error scraping company data");
      throw error;
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!orgInfo) {
    return (
      <div className="m-auto p-10 w-[60rem] bg-white flex justify-center items-center">
        <Loading size={10} color="primary" />
      </div>
    );
  }

  return (
    <div className="m-auto p-10 w-[70rem] bg-white">
      <h1 className="text-2xl font-bold mb-10 text-center">Company Profile</h1>
      <div className="text-lg space-y-8">
        <div>
          <strong>Name:</strong>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 rounded w-full"
          />
        </div>
        <div>
          <strong>Website:</strong>
          <div className="flex items-center mt-1">
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="p-2 border bg-gray-50 rounded flex-grow"
            />
            <button
              onClick={SummarizeAI}
              className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="Summarize with AI"
              disabled={isSummarizing}
            >
              {isSummarizing ? (
                <span className="flex justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div>
          <strong>Overview:</strong>
          <textarea
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 h-60 rounded w-full"
          />
        </div>
        <div>
          <strong>Products and Services:</strong>
          <textarea
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 h-60 rounded w-full"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleUpdateProfile}
            className={`w-40 py-2 flex items-center justify-center h-12 bg-blue-500 text-white rounded ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? <Loading size={5} color="white" /> : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
