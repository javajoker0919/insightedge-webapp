import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { supabase } from "@/utils/supabaseClient";

import Modal from "@/app/components/Modal";
import { orgInfoAtom, userInfoAtom } from "@/utils/atoms";
import MarketingStrategyTable from "./MarketingStrategyTable";
import { generateTMAPI } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { Loading } from "@/app/components";

interface MarketingCompProps {
  companyName: string;
  etID: number | null;
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

const MarketingStrategySection: React.FC<MarketingCompProps> = ({
  companyName,
  etID,
}) => {
  if (etID === null) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const orgInfo = useAtomValue(orgInfoAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedStrats, setSelectedMS] = useState<MarketingProps | null>(null);
  const [generalMarketings, setGMs] = useState<MarketingProps[] | null>(null);
  const [tailoredMarketings, setTMs] = useState<MarketingProps[] | null>(null);

  const [isFetchingGM, setIsFetchingGM] = useState<boolean>(true);
  const [isFetchingTM, setIsFetchingTM] = useState<boolean>(true);
  const [isGeneratingTM, setIsGeneratingTM] = useState<boolean>(false);

  useEffect(() => {
    if (etID) {
      fetchGM(etID);
    }
  }, [etID]);

  useEffect(() => {
    if (etID && orgInfo && orgInfo.id) {
      fetchTM(etID, orgInfo.id);
    }
  }, [etID, orgInfo]);

  const fetchGM = async (etID: number) => {
    setIsFetchingGM(true);
    setGMs(null);

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
      setIsFetchingGM(false);
    }
  };

  const fetchTM = async (etID: number, orgID: number) => {
    setIsFetchingTM(true);
    setTMs(null);

    try {
      const { data, error } = await supabase
        .from("tailored_marketings")
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
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

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

      setTMs(strategies);
    } catch (error) {
      console.error("Error fetching tailored marketing strategies:", error);
    } finally {
      setIsFetchingTM(false);
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
        (item: any) => ({
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
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        {tailoredMarketings &&
        tailoredMarketings.length > 0 &&
        !isFetchingTM ? (
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
        ) : (
          <div className="flex w-full justify-between items-center pr-4 py-1">
            <h3 className="px-4 py-3 font-medium text-gray-700">
              Marketing Strategy
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
        )}
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
        {activeTab === "general" &&
          (isFetchingGM ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black min-w-[1200px]">
                {companyName}'s top Marketing Strategy.
                {tailoredMarketings?.length === 0 && (
                  <span>
                    {`To find the best ways to sell your solutions to 
                      ${companyName}, click "Generate Tailored Marketing
                      Strategy."`}
                  </span>
                )}
              </div>
              {generalMarketings && (
                <MarketingStrategyTable
                  strategies={generalMarketings}
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
        {activeTab === "tailored" &&
          (isFetchingTM ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black">
                Below is your company specific marketing strategy. You can
                explore the top marketing tactics for selling your solutions to{" "}
                {companyName}
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

      <Modal
        wrapperClass="backdrop-blur-[2px]"
        modalClass="w-full mx-16 min-w-[60rem] xl:max-w-[50rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
        isOpen={!!selectedStrats}
        onClose={() => setSelectedMS(null)}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-600">
              Marketing Plan
            </h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Key Performance Indicators
              </h3>
              <ul className="list-disc pl-8 space-y-3">
                {selectedStrats?.keyPerformanceIndicators.map(
                  (kpi: string, index: number) => (
                    <li key={`kpi_${index}`}>
                      <p className="text-gray-700">{kpi}</p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Strategic Alignment
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">
                  {selectedStrats?.strategicAlignment}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Call to Action
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{selectedStrats?.callToAction}</p>
              </div>
            </section>
          </div>
        </div>
      </Modal>
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
