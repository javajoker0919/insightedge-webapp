import { useState, useEffect } from "react";

import { supabase } from "@/utils/supabaseClient";
import MarketingStrategyTable from "./MarketingStrategyTable";
import MarketingPlanModal from "./MarketingPlanModal";
import Loading from "@/app/components/Loading";
import { generateTMAPI } from "@/utils/apiClient";
import { userInfoAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";
import { useToastContext } from "@/contexts/toastContext";

interface MarketingCompProps {
  companyName: string;
  etID: number | null;
  isLoading: boolean;
}

export interface MarketingProps {
  tactic: string;
  tacticScore: number;
  targetPersonas: string;
  channel: string;
  valueProposition: string;
  keyPerformanceIndicators: string[];
  strategicAlignment: string;
  callToAction: string;
}

interface genTMResType {
  call_to_action: string;
  channel: string;
  company_name: string;
  earnings_transcript_id: number;
  key_performance_indicators: string;
  strategic_alignment: string;
  tactic: string;
  tactic_score: string;
  target_personas: string;
  value_proposition: string;
}

const MarketingStrategySection: React.FC<MarketingCompProps> = ({
  companyName,
  etID,
  isLoading,
}) => {
  if (etID === null) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const setUserInfo = useSetAtom(userInfoAtom);
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedStrats, setSelectedMS] = useState<MarketingProps | null>(null);
  const [generalStrats, setGMs] = useState<MarketingProps[] | null>(null);
  const [tailoredMarketings, setTMs] = useState<MarketingProps[] | null>(null);
  const [isGeneralLoading, setIsGeneralLoading] = useState<boolean>(false);
  const [isTailoredLoading, setIsTailoredLoading] = useState<boolean>(false);
  const [isGeneratingTM, setIsGeneratingTM] = useState<boolean>(false);

  useEffect(() => {
    if (etID) {
      fetchMarketingStrategies(etID);
      setTMs(null);
    }
  }, [etID]);

  const fetchMarketingStrategies = async (etID: number) => {
    setIsGeneralLoading(true);
    setIsTailoredLoading(true);

    try {
      const { data, error } = await supabase
        .from("general_marketings")
        .select(
          `
          tactic,
          tactic_score, 
          target_personas, 
          channel, 
          value_proposition, 
          key_performance_indicators, 
          strategic_alignment, 
          call_to_action
          `
        )
        .eq("earnings_transcript_id", etID);

      if (error) throw error;

      const strategies = data.map((item: any) => ({
        tactic: item.tactic,
        tacticScore: parseFloat(item.tactic_score),
        targetPersonas: item.target_personas,
        channel: item.channel,
        valueProposition: item.value_proposition,
        keyPerformanceIndicators: item.key_performance_indicators
          .replace(/[\[\]"]/g, "")
          .split(", "),
        strategicAlignment: item.strategic_alignment,
        callToAction: item.call_to_action,
      }));

      setGMs(strategies);
      setActiveTab("general");
    } catch (error) {
      console.error("Error fetching marketing strategies:", error);
    } finally {
      setIsGeneralLoading(false);
      setIsTailoredLoading(false);
    }
  };

  const handleGenerateTMs = async () => {
    if (!etID) {
      return;
    }

    setIsGeneratingTM(true);

    try {
      const { data } = await generateTMAPI([etID]);

      const formattedData: MarketingProps[] = data.marketings.map(
        (item: genTMResType) => ({
          tactic: item.tactic,
          tacticScore: parseFloat(item.tactic_score),
          companyName: item.company_name,
          targetPersonas: item.target_personas,
          channel: item.channel,
          valueProposition: item.value_proposition,
          keyPerformanceIndicators: item.key_performance_indicators
            .replace(/[\[\]"]/g, "")
            .split(", "),
          strategicAlignment: item.strategic_alignment,
          callToAction: item.call_to_action,
        })
      );

      setTMs(formattedData);
      setActiveTab("tailored");
      setUserInfo((prev) => {
        if (!prev || !prev.creditCount) return prev;
        return {
          ...prev,
          creditCount: prev.creditCount
            ? prev.creditCount - data.used_credits
            : 0,
        };
      });
      invokeToast("success", data.message, "top");
    } catch (error) {
      console.error(error);
      invokeToast(
        "error",
        "Failed to generate tailored marketing strategies",
        "top"
      );
    } finally {
      setIsGeneratingTM(false);
    }
  };

  const handleQuickAction = (strt: MarketingProps) => {
    setSelectedMS(strt);
  };

  return (
    <div className="bg-primary border border-gray-300 rounded-lg bg-white overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        {tailoredMarketings === null ? (
          <div className="flex w-full justify-between items-center pr-4 py-1">
            <h3 className="px-4 py-3 font-medium text-gray-700">
              Marketing Strategy
            </h3>
            {tailoredMarketings === null && !isTailoredLoading && (
              <button
                onClick={handleGenerateTMs}
                disabled={isGeneratingTM}
                className="px-4 py-2 w-72 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
              >
                {isGeneratingTM ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                ) : (
                  "Generate Tailored Marketing Strategies"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-4 border-primary-600 border-b-2 ${
                activeTab === "general"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              General Marketing Strategy
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-4 border-primary-600 border-b-2 ${
                activeTab === "tailored"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              Tailored Marketing Strategy
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
          {activeTab === "general" &&
            (isGeneralLoading ? (
              <LoadingSection />
            ) : (
              <>
                <div className="p-4 bg-gray-100 text-black">
                  {companyName}'s top Marketing Strategy.
                  {tailoredMarketings?.length === 0 && (
                    <span>
                      {`To find the best ways to sell your solutions to 
                      ${companyName}, click "Generate Tailored Marketing
                      Strategy."`}
                    </span>
                  )}
                </div>
                {generalStrats && (
                  <MarketingStrategyTable
                    strategies={generalStrats}
                    onQuickAction={handleQuickAction}
                  />
                )}
              </>
            ))}
          {activeTab === "tailored" &&
            (isTailoredLoading ? (
              <LoadingSection />
            ) : (
              <>
                <div className="p-4 bg-gray-100 text-black">
                  Below is your company specific marketing strategy. You can
                  explore the top marketing tactics for selling your solutions
                  to {companyName}
                </div>
                {tailoredMarketings && (
                  <MarketingStrategyTable
                    strategies={tailoredMarketings}
                    onQuickAction={handleQuickAction}
                  />
                )}
              </>
            ))}
        </div>
      )}

      <MarketingPlanModal
        open={!!selectedStrats}
        onClose={() => setSelectedMS(null)}
        selectedStrats={selectedStrats}
      />
    </div>
  );
};

const LoadingSection: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-44">
      <Loading />
    </div>
  );
};

export default MarketingStrategySection;
