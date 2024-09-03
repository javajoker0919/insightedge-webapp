"use client";

import { useState, useEffect } from "react";

import { FaPlus } from "react-icons/fa";

import { supabase } from "@/utils/supabaseClient";
import { CompanyProps } from "../../app/watchlist/[id]/page";
import Loading from "../Loading";
import { getMixPanelClient } from "@/utils/mixpanel";

interface WLSimilarCompanySectionProps {
  watchlistCompanies: CompanyProps[];
  handleAddCompanyToWatchlist: (companyID: number) => void;
  isLoading: boolean;
}

const WLSimilarCompanySection: React.FC<WLSimilarCompanySectionProps> = ({
  watchlistCompanies,
  handleAddCompanyToWatchlist,
  isLoading,
}) => {
  const mixpanel = getMixPanelClient();

  const [similarCompanies, setSimilarCompanies] = useState<CompanyProps[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const randomColor = [
    "bg-fuchsia-800",
    "bg-teal-800",
    "bg-gray-800",
    "bg-red-800",
    "bg-blue-800",
    "bg-green-800",
    "bg-purple-800",
  ];

  useEffect(() => {
    if (isLoading || watchlistCompanies.length === 0) {
      return;
    }

    const companyIDs = watchlistCompanies.map((company) => company.id);
    const companyIndustries = Array.from(
      new Set(watchlistCompanies.map((company) => company.industry))
    );

    fetchSimilarCompanies(companyIDs, companyIndustries);
  }, [watchlistCompanies]);

  const fetchSimilarCompanies = async (IDs: number[], industries: string[]) => {
    setIsFetching(true);

    try {
      const { data: similarCompaniesData, error: similarCompaniesError } =
        await supabase
          .from("companies")
          .select("id, name, symbol, industry")
          .in("industry", industries)
          .not("id", "in", `(${IDs.join(",")})`) // Exclude companies already in the watchlist
          .order("revrank", { ascending: true })
          .limit(10);

      if (similarCompaniesError) {
        console.error(
          "Error fetching similar companies:",
          similarCompaniesError
        );
      } else if (similarCompaniesData) {
        const formattedData = similarCompaniesData.map((company) => ({
          id: company.id,
          name: company.name,
          symbol: company.symbol,
          industry: company.industry,
        }));
        setSimilarCompanies(formattedData);
      }
    } catch (error) {
      console.error("Error fetching similar companies:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className={`bg-gray-100 border-b font-medium text-gray-700 p-3`}>
        <p className="font-bold">Similar Companies</p>
        <p className="text-sm text-gray-400">Based on your watchlist</p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isFetching ? (
          <div className="flex justify-center h-20 items-center">
            <Loading />
          </div>
        ) : (
          <ul className="divide-y">
            {similarCompanies.map((company) => (
              <li key={company.id}>
                <a
                  href={`/app/company/${company.id}`}
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
                    onClick={(e) => {
                      e.preventDefault();

                      mixpanel.track("company.add", {
                        $source: "watchlist_page.similar_companies",
                      });

                      handleAddCompanyToWatchlist(company.id);
                      setSimilarCompanies((prev) =>
                        prev.filter((item) => item.id !== company.id)
                      );
                    }}
                    className="p-4 hover:bg-gray-200 rounded-full"
                  >
                    <FaPlus className="text-primary-500" />
                  </button>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WLSimilarCompanySection;
