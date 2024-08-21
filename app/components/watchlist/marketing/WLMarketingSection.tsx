"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/utils/supabaseClient";

import Modal from "@/app/components/Modal";
import MarketingStrategyTable from "./WLMarketingTable";
import { useToastContext } from "@/contexts/toastContext";
import { Loading } from "../..";
import { generateTMAPI } from "@/utils/apiClient";
import { userInfoAtom, orgInfoAtom } from "@/utils/atoms";
import { useAtomValue, useSetAtom } from "jotai";

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

const WLMarketingSection: React.FC<MarketingStrategiesProps> = ({ etIDs }) => {
  if (etIDs === null) {
    return;
  }

  const { invokeToast } = useToastContext();
  const setUserInfo = useSetAtom(userInfoAtom);
  const orgInfo = useAtomValue(orgInfoAtom);

  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedMSs, setSelectedMSs] = useState<MarketingProps | null>(null);
  const [generalMarketings, setGMs] = useState<MarketingProps[] | null>(null);
  const [tailoredMarketings, setTMs] = useState<MarketingProps[] | null>(null);

  const [isFetchingGM, setIsFetchingGM] = useState<boolean>(true);
  const [isFetchingTM, setIsFetchingTM] = useState<boolean>(true);
  const [isGeneratingTM, setIsGeneratingTM] = useState<boolean>(false);

  const [companyCount, setCompanyCount] = useState<number | null>(null);

  useEffect(() => {
    if (etIDs && etIDs.length > 0) {
      fetchGMs(etIDs);
    }
  }, [etIDs]);

  useEffect(() => {
    if (etIDs && etIDs.length > 0 && orgInfo && orgInfo.id) {
      fetchTMs(etIDs, orgInfo.id);
    }
  }, [etIDs, orgInfo]);

  const fetchGMs = async (etIDs: number[]) => {
    if (etIDs.length === 0) {
      return;
    }

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

      setGMs(strategies);
    } catch (error) {
      console.error("Error fetching marketing strategies:", error);
    } finally {
      setIsFetchingGM(false);
    }
  };

  const fetchTMs = async (etIDs: number[], orgID: number) => {
    if (etIDs.length === 0) {
      return;
    }

    setIsFetchingTM(true);
    setTMs(null);
    setCompanyCount(null);

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
          call_to_action, 
          earnings_transcripts (
            company_id
          )
          `
        )
        .eq("organization_id", orgID)
        .in("earnings_transcript_id", etIDs);

      if (error) throw error;

      const companyIDs = Array.from(
        new Set(data.map((item: any) => item.earnings_transcripts.company_id))
      );

      setCompanyCount(companyIDs.length);

      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select("id, name")
        .in("id", companyIDs);

      if (companiesError) throw companiesError;

      const companyMap = companiesData.reduce((acc: any, company: any) => {
        acc[company.id] = company.name;
        return acc;
      }, {});

      const marketings = data.map((item: any) => ({
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

      setTMs(marketings);
    } catch (error) {
      console.error("Error fetching tailored marketings:", error);
    } finally {
      setIsFetchingTM(false);
    }
  };

  const handleGenerateTMs = async () => {
    if (!etIDs || etIDs.length === 0) {
      invokeToast("error", "No earnings transcripts selected", "top");
      return;
    }

    setIsGeneratingTM(true);

    try {
      const { data } = await generateTMAPI(etIDs);

      const formattedData: MarketingProps[] = data.marketings.map(
        (item: any) => ({
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

      // Calculate unique company name count
      const uniqueCompanyNames = new Set(
        formattedData.map((item) => item.companyName)
      );

      setCompanyCount(uniqueCompanyNames.size);
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
      invokeToast(
        "error",
        "Failed to generate tailored marketing strategies",
        "top"
      );
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.error(
            "Request timed out. The backend operation might take longer than expected."
          );
        } else if (error.response?.status !== 200) {
          console.error(`HTTP error! status: ${error.response?.status}`);
        }
      }
      console.error("Error fetching protected data:", error);
    } finally {
      setIsGeneratingTM(false);
    }
  };

  const handleQuickAction = (strt: MarketingProps) => {
    setSelectedMSs(strt);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between rounded-t-lg">
        {companyCount && companyCount > 0 ? (
          <div className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-3 sm:py-4 border-primary-600 border-b-2 w-full sm:w-auto ${
                activeTab === "general"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              General Marketing Strategy
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-3 sm:py-4 border-primary-600 border-b-2 w-full sm:w-auto ${
                activeTab === "tailored"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              Tailored Marketing Strategy
            </button>
          </div>
        ) : (
          <div className="p-4">
            <p className="font-medium text-gray-700">Marketing Strategies</p>
          </div>
        )}

        {isFetchingTM || companyCount === null ? (
          <></>
        ) : companyCount === etIDs.length ? (
          <></>
        ) : (
          <div className="p-2">
            {isGeneratingTM ? (
              <button className="px-4 py-2 w-80 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out">
                <Loading size={5} color="white" />
              </button>
            ) : companyCount === 0 ? (
              <button
                onClick={handleGenerateTMs}
                className="px-4 py-2 w-80 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
              >
                <span>Generate Tailored Marketing Strategies</span>
              </button>
            ) : companyCount < etIDs.length ? (
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full">
                    !
                  </span>
                  <div className="absolute bottom-full mb-2 z-50 hidden w-80 p-2 text-sm text-white bg-stone-700 rounded-md shadow-lg group-hover:block">
                    {`Tailored marketing strategies are not generated for ${
                      etIDs.length - companyCount
                    } ${
                      etIDs.length - companyCount > 1 ? "companies" : "company"
                    }. Please click to generate for the remaining ${
                      etIDs.length - companyCount > 1 ? "companies" : "company"
                    }.`}
                  </div>
                </div>
                <button
                  onClick={handleGenerateTMs}
                  className="px-4 py-2 w-80 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  <span className="flex items-center gap-1">
                    {`Update Tailored Marketing Strategies (${
                      etIDs.length - companyCount
                    })`}
                  </span>
                </button>
              </div>
            ) : (
              <></>
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
        modalClass="w-full mx-16 min-w-[60rem] xl:min-w-[80rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
        isOpen={!!selectedMSs}
        onClose={() => setSelectedMSs(null)}
      >
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-600">
              Marketing Plan
            </h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Tactic
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {selectedMSs?.tactic}
              </p>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Value Proposition
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {selectedMSs?.valueProposition}
              </p>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Key Performance Indicators
              </h3>
              <ul className="list-disc pl-5 sm:pl-8 space-y-3">
                {selectedMSs?.keyPerformanceIndicators.map(
                  (kpi: string, index: number) => (
                    <li key={`kpi_${index}`}>
                      <p className="text-sm sm:text-base text-gray-700">
                        {kpi}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Call to Action
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                {selectedMSs?.callToAction}
              </p>
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

export default WLMarketingSection;
