"use client";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

import { supabase } from "@/utils/supabaseClient";
import { Loading } from "../..";
import { CompanyProps } from "./InitialCompanySection";

interface WatchlistSimilarCompaniesProps {
  companies: CompanyProps[];
  setCompanies: React.Dispatch<React.SetStateAction<any[]>>;
}

const OnboardSimilarCompanySection: React.FC<
  WatchlistSimilarCompaniesProps
> = ({ companies, setCompanies }) => {
  const [similarCompanies, setSimilarCompanies] = useState<CompanyProps[]>([]);
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
    fetchSimilarCompanies();
  }, [companies]);

  const fetchSimilarCompanies = async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from("companies")
        .select("id, name, symbol, revrank, industry")
        .order("revrank", { ascending: true })
        .limit(10);

      if (companies.length > 0) {
        const IDs = Array.from(new Set(companies.map((company) => company.id)));
        query = query.not("id", "in", `(${IDs.join(",")})`);

        const industries = Array.from(
          new Set(companies.map((company) => company.industry))
        );
        query = query.in("industry", industries);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching similar companies:", error);
      } else if (data) {
        const formattedData = data.map((company: any) => ({
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
      setIsLoading(false);
    }
  };

  const handleAddCompanyToCompanies = async (company: CompanyProps) => {
    if (companies.map((company) => company.id).includes(company.id)) {
      return;
    }

    setCompanies((prevCompanies) => [...prevCompanies, company]);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className={`bg-gray-100 border-b font-medium text-gray-700 p-3`}>
        <p className="font-bold">Similar Companies</p>
        <p className="text-sm text-gray-400">Based on your watchlist</p>
      </div>

      <div className="h-96 w-[30rem] overflow-y-auto">
        {isLoading ? (
          <div className="flex w-full h-full justify-center items-center">
            <Loading />
          </div>
        ) : (
          <ul className="divide-y">
            {similarCompanies.map(
              (company) =>
                !companies
                  .map((company) => company.id)
                  .includes(company.id) && (
                  <li key={company.id}>
                    <div className="px-2 py-1 flex items-center gap-1 justify-between">
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
                        onClick={(e) => handleAddCompanyToCompanies(company)}
                        className="p-4 hover:bg-gray-200 rounded-full"
                      >
                        <FaPlus className="text-primary-500" />
                      </button>
                    </div>
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OnboardSimilarCompanySection;
