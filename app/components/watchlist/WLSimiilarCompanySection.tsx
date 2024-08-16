"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { CompanyDataType } from "../../app/watchlist/[id]/page";
import { supabase } from "@/utils/supabaseClient";
import Loading from "../Loading";
import { PlusSvg } from "@/app/app/company/[id]/components";
import { watchlistAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";

interface WatchlistSimilarCompaniesProps {
  companies: CompanyDataType[];
  setWatchlistCompanies: React.Dispatch<React.SetStateAction<any[]>>;
}

interface SimilarCompanyDataType extends CompanyDataType {
  revrank: number;
  industry: string;
}

const WLSimilarCompanySection: React.FC<WatchlistSimilarCompaniesProps> = ({
  companies,
  setWatchlistCompanies,
}) => {
  const params = useParams();
  const paramID = params.id as string;
  const watchlist = useAtomValue(watchlistAtom);
  const [similarCompanies, setSimilarCompanies] = useState<
    SimilarCompanyDataType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    const fetchSimilarCompanies = async () => {
      try {
        setIsLoading(true);

        const companyIDs = companies.map((company) => company.id);

        const { data: industryData, error: industryError } = await supabase
          .from("companies")
          .select("industry")
          .in("id", companyIDs);

        if (industryError) {
          console.error("Error fetching industries:", industryError);
        } else if (industryData) {
          const industries = industryData.map(
            (item: { industry: string }) => item.industry
          );

          const { data: similarCompaniesData, error: similarCompaniesError } =
            await supabase
              .from("companies")
              .select("id, name, symbol, revrank, industry")
              .in("industry", industries)
              .not("id", "in", `(${companyIDs.join(",")})`) // Exclude companies already in the watchlist
              .order("revrank", { ascending: true })
              .limit(10);

          if (similarCompaniesError) {
            console.error(
              "Error fetching similar companies:",
              similarCompaniesError
            );
          } else if (similarCompaniesData) {
            const formattedData = similarCompaniesData.map((company: any) => ({
              id: company.id,
              name: company.name,
              symbol: company.symbol,
              revrank: company.revrank,
              industry: company.industry,
              watchlist_company_id: 0,
            }));
            setSimilarCompanies(formattedData);
          }
        }
      } catch (error) {
        console.error("Error fetching similar companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companies.length > 0) {
      fetchSimilarCompanies();
    }
  }, [companies]);

  const handleAddToWatchlist = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    companyID: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const watchlistId = watchlist?.find((item) => item.uuid === paramID)?.id;

    if (!watchlistId) {
      console.error("Watchlist ID not found");
      return;
    }

    const { data, error } = await supabase
      .from("watchlist_companies")
      .insert({ company_id: companyID, watchlist_id: watchlistId })
      .select();

    if (error) {
      console.error("Error adding company to watchlist:", error);
    } else {
      // Fetch the newly added company and update the state
      const { data: newCompany, error: fetchError } = await supabase
        .from("companies")
        .select("id, name, symbol")
        .eq("id", companyID)
        .single();

      if (fetchError) {
        console.error("Error fetching new company:", fetchError);
      } else if (data && data.length > 0) {
        setWatchlistCompanies((prevCompanies) => [
          ...prevCompanies,
          { ...newCompany, watchlist_company_id: data[0].id },
        ]);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className={`bg-gray-100 border-b font-medium text-gray-700 p-3`}>
        <p className="font-bold">Similar Companies</p>
        <p className="text-sm text-gray-400">Based on your watchlist</p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
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
                  <button
                    onClick={(e) => handleAddToWatchlist(e, company.id)}
                    className="p-4 hover:bg-gray-200 rounded-full"
                  >
                    <PlusSvg />
                  </button>

                  <div className="space-y-1 w-full p-2">
                    <h4 className="font-semibold text-gray-700">
                      {company.name}
                    </h4>

                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm text-white py-0.5 px-1 ${
                          randomColor[
                            Math.floor(Math.random() * randomColor.length)
                          ]
                        }`}
                      >
                        {company.symbol}
                      </p>
                      <p className="text-gray-600 border rounded-full border-yellow-200 bg-yellow-50 text-sm py-0.5 px-2">
                        {company.industry}
                      </p>
                    </div>
                  </div>
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
