import { useState } from "react";
import { useAtomValue } from "jotai";
import { motion } from "framer-motion";
import { CompanyDataType } from "./page";
import { generateTailoredSummaryAPI } from "@/utils/apiClient";
import {
  ICompanyData,
  latestCompanyEarningsData,
  orgInfoAtom,
} from "@/utils/atoms";
import { useToastContext } from "@/contexts/toastContext";

import RenderSummaryContent from "../../../components/company/summary/RenderSummaryContent";
import { SummaryProps } from "../../../components/company/summary/SummarySection";

interface WatchlistHighlightsProps {
  watchlistName: string;
  companyList: CompanyDataType[];
}
const WatchlistHighlights: React.FC<WatchlistHighlightsProps> = ({
  watchlistName,
  companyList,
}) => {
  const { invokeToast } = useToastContext();
  const orgInfo = useAtomValue(orgInfoAtom);
  const latestETData = useAtomValue(latestCompanyEarningsData);

  const [showFullSummary, setShowFullSummary] = useState<boolean>(true);
  const [tailoredOppGeneratedPercent, setTailoredOppGeneratedPercent] =
    useState<number>(0);
  const [tailoredSummary, setTailoredSummary] = useState<SummaryProps | null>(
    null
  );

  const fetchTailoredOpportunities = async (): Promise<void> => {
    const companyData = latestETData.data as ICompanyData[];
    return new Promise<void>(async (resolve, reject) => {
      const totalRequests = companyData?.length || 1;
      let completedRequests = 0;

      const requests = companyData?.map(async (company) => {
        const year = company.year;
        const quarter = company.quarter;

        try {
          const res = await generateTailoredSummaryAPI({
            companyID: company.company_id,
            orgID: orgInfo?.id.toString() || "",
            year,
            quarter,
          });

          if (res.data.status === "error") {
            console.error(
              "Error generating tailored summary:",
              res.data.message
            );
            reject();
            return;
          }

          invokeToast("success", `${company.symbol} Summary Generated`, "top");

          const summaryData = Object.keys(res.data.summary).reduce(
            (acc, key) => ({
              ...acc,
              [key]: [
                ...(acc[key as keyof SummaryProps] || []),
                ...(res.data.summary[key]?.split("\n") || []),
              ],
            }),
            tailoredSummary as SummaryProps
          );

          setTailoredSummary((prevSummary) => ({
            ...prevSummary,
            ...summaryData,
          }));

          completedRequests += 1;
          const progress = Math.round(
            (completedRequests / totalRequests) * 100
          );
          setTailoredOppGeneratedPercent(progress);

          if (completedRequests === totalRequests) {
            resolve();
          }
        } catch (error) {
          console.error("Error generating tailored summary:", error);
          reject();
        }
      });

      if (requests) {
        await Promise.all(requests);
      }
    });
  };

  const generateTailoredSummary = () => {
    if (companyList.length > 0 && latestETData.data !== null) {
      fetchTailoredOpportunities();
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <summary
        className={`bg-gray-100 font-medium text-gray-700 flex items-center justify-between p-2`}
      >
        <div className="flex flex-col justify-between w-full">
          {orgInfo && tailoredOppGeneratedPercent <= 0 ? (
            <button
              title="Get custom earnings report summaries tailored to your business needs"
              onClick={generateTailoredSummary}
              className="ml-2 px-3 flex items-center justify-center py-2 bg-primary-600 text-white rounded-md text-sm"
            >
              <span>Generate Tailored Highlight for "{watchlistName}"</span>
            </button>
          ) : (
            <>
              <motion.p
                className="text-gray-700 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {watchlistName} Highlights
              </motion.p>
              {tailoredOppGeneratedPercent > 0 &&
                tailoredOppGeneratedPercent < 100 && (
                  <motion.div
                    className="flex w-full justify-start h-1 bg-primary-600 rounded-md"
                    initial={{ width: "0%" }}
                    animate={{ width: `${tailoredOppGeneratedPercent || 50}%` }}
                    transition={{ duration: 0.5 }}
                  />
                )}
            </>
          )}
        </div>
      </summary>
      <div className="px-3 py-1">
        <RenderSummaryContent
          key={`summary-${tailoredSummary?.summary?.length || 0}`}
          data={tailoredSummary}
          showFullSummary={showFullSummary}
          setShowFullSummary={setShowFullSummary}
        />
      </div>
    </div>
  );
};

export default WatchlistHighlights;
