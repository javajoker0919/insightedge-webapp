"use client";
import { useState, useEffect } from "react";

import { CompanyDataType } from "../../app/watchlist/[id]/page";
import { supabase } from "@/supabase";
import Loading from "../Loading";

interface WatchlistHighlightsProps {
  companyList: CompanyDataType[];
}

const WLHighlightSection: React.FC<WatchlistHighlightsProps> = ({
  companyList,
}) => {
  const [keyHighlights, setKeyHighlights] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchKeyHighlights = async () => {
      try {
        setIsLoading(true);

        const companyIDs = companyList.map((company) => company.id);

        const { data: khData, error: khError } = await supabase
          .from("earnings_transcripts")
          .select("company_id, keyhighlight")
          .in("company_id", companyIDs)
          .not("keyhighlight", "is", null);

        if (khError) {
          console.error("Error fetching key highlights:", khError);
        } else if (khData) {
          const highlights = khData.reduce(
            (acc, { company_id, keyhighlight }) => {
              const companyName = companyList.find(
                (company) => company.id === company_id
              )?.name;
              if (companyName) {
                acc[companyName] = keyhighlight;
              }
              return acc;
            },
            {} as { [key: string]: string }
          );

          const sortedHighlights = Object.fromEntries(
            Object.entries(highlights).sort(([a], [b]) => a.localeCompare(b))
          );

          setKeyHighlights(sortedHighlights);
        }
      } catch (error) {
        console.error("Error fetching key highlights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyList.length > 0) {
      fetchKeyHighlights();
    }
  }, [companyList]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className={`bg-gray-100 border-b font-medium text-gray-700 p-3`}>
        <p className="font-bold">Highlights</p>
        <p className="text-sm text-gray-400">Based on your watchlist</p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center h-20 items-center">
            <Loading />
          </div>
        ) : Object.entries(keyHighlights).length > 0 ? (
          <ul className="list-disc p-2 pl-8">
            {Object.entries(keyHighlights).map(([companyName, highlight]) => (
              <li key={companyName} className="mb-4">
                <h4 className="font-semibold text-gray-700">{companyName}</h4>
                <p className="text-sm text-gray-600">{highlight}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-20">
            <span className="text-sm text-gray-700">No Highlights</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WLHighlightSection;
