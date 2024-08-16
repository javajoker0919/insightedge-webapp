"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import MarketingStrategyTable from "./WLMarketignTable";
import MarketingPlanModal from "./WLMarketingModal";
import Loading from "@/app/components/Loading";
import { generateTMAPI } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { userInfoAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";

interface MarketingStrategiesProps {
  etIDs: number[] | null;
}

export interface MarketingProps {
  tactic: string;
  tacticScore: number;
  companyName: string;
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

const WLMarketingSection: React.FC<MarketingStrategiesProps> = ({ etIDs }) => {
  const { invokeToast } = useToastContext();
  const setUserInfo = useSetAtom(userInfoAtom);

  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedStrats, setSelectedStrats] = useState<MarketingProps | null>(
    null
  );
  const [generalStrats, setGeneralStrats] = useState<MarketingProps[] | null>(
    null
  );
  const [tailoredMarketings, setTMs] = useState<MarketingProps[] | null>(null);

  const [isFetchingGM, setIsFetchingGM] = useState<boolean>(false);
  const [isFetchingTM, setIsFetchingTM] = useState<boolean>(false);
  const [isGeneratingTM, setIsGeneratingTM] = useState<boolean>(false);

  useEffect(() => {
    if (etIDs && etIDs.length > 0) {
      fetchMarketingStrategies(etIDs);
      fetchTMs(etIDs);
    }
  }, [etIDs]);

  const fetchMarketingStrategies = async (etIDs: number[]) => {
    setIsFetchingGM(true);

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
          call_to_action, 
          earnings_transcripts (
            company_id
          )
          `
        )
        .in("earnings_transcript_id", etIDs);

      if (error) throw error;

      const companyIds = data.map(
        (item: any) => item.earnings_transcripts.company_id
      );
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("id, name")
        .in("id", companyIds);

      if (companiesError) throw companiesError;

      const companyMap = companiesData.reduce((acc: any, company: any) => {
        acc[company.id] = company.name;
        return acc;
      }, {});

      const strategies = data.map((item: any) => ({
        tactic: item.tactic,
        tacticScore: parseFloat(item.tactic_score),
        companyName: companyMap[item.earnings_transcripts.company_id],
        targetPersonas: item.target_personas,
        channel: item.channel,
        valueProposition: item.value_proposition,
        keyPerformanceIndicators: item.key_performance_indicators
          .replace(/[\[\]"]/g, "")
          .split(", "),
        strategicAlignment: item.strategic_alignment,
        callToAction: item.call_to_action,
      }));

      setGeneralStrats(strategies);
      setActiveTab("general");
    } catch (error) {
      console.error("Error fetching marketing strategies:", error);
    } finally {
      setIsFetchingGM(false);
    }
  };

  const fetchTMs = async (etIDs: number[]) => {
    setIsFetchingTM(true);

    try {
    } catch (error) {
      // invokeToast("error", "Failed to generate tailored opportunities", "top");
      // if (axios.isAxiosError(error)) {
      //   if (error.code === "ECONNABORTED") {
      //     console.error(
      //       "Request timed out. The backend operation might take longer than expected."
      //     );
      //   } else if (error.response?.status !== 200) {
      //     console.error(`HTTP error! status: ${error.response?.status}`);
      //   }
      // }
      console.error("Error fetching tailored marketings:", error);
    } finally {
      setIsFetchingTM(false);
    }
  };

  const handleGenerateTMs = async () => {
    if (!etIDs) {
      return;
    }

    setIsGeneratingTM(true);

    try {
      const { data } = await generateTMAPI(etIDs);

      console.log("tailored marketings: ", data);

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
        if (!prev) return prev;
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
    } finally {
      setIsGeneratingTM(false);
    }
  };

  const handleQuickAction = (strt: MarketingProps) => {
    setSelectedStrats(strt);
  };

  return (
    <div className="bg-primary border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        {tailoredMarketings === null ? (
          <div className="flex w-full justify-between items-center pr-4 py-1">
            <h3 className="px-4 py-3 font-medium text-gray-700">
              Marketing Strategies
            </h3>
            {!isFetchingTM && (
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

      {etIDs === null ? (
        <LoadingSection />
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
          {activeTab === "general" &&
            (isFetchingGM ? (
              <LoadingSection />
            ) : (
              <>
                {generalStrats && (
                  <MarketingStrategyTable
                    strategies={generalStrats}
                    onQuickAction={handleQuickAction}
                  />
                )}
              </>
            ))}
          {activeTab === "tailored" &&
            (isGeneratingTM ? (
              <LoadingSection />
            ) : (
              <>
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
        onClose={() => setSelectedStrats(null)}
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

export default WLMarketingSection;
