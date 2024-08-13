"use client";
import { useState, useEffect } from "react";

import { CompanyDataType } from "../../app/watchlist/[id]/page";
import { supabase } from "@/utils/supabaseClient";
import Loading from "../Loading";

interface WatchlistSimilarCompaniesProps {
  companies: CompanyDataType[];
}

interface SimilarCompanyDataType extends CompanyDataType {
  revrank: number;
  industry: string;
}

const WLSimilarCompanySection: React.FC<WatchlistSimilarCompaniesProps> = ({
  companies,
}) => {
  const [similarCompanies, setSimilarCompanies] = useState<
    SimilarCompanyDataType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
                  className="block hover:bg-gray-50 px-3 py-2"
                >
                  <h4 className="font-semibold text-gray-700">
                    {company.name}
                  </h4>

                  <p className="text-sm text-gray-600">
                    {company.symbol} - {company.industry}
                  </p>
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
