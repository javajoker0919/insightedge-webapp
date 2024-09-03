"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faFileCsv } from "@fortawesome/free-solid-svg-icons"; // Add this import

import { supabase } from "@/utils/supabaseClient";
import { Modal, Loading } from "@/app/components";
import MarketingStrategyTable from "./WLMarketingTable";
import { useToastContext } from "@/contexts/toastContext";
import { generateTMAPI } from "@/utils/apiClient";
import { profileAtom, userInfoAtom, orgInfoAtom } from "@/utils/atoms";
import { getMixPanelClient } from "@/utils/mixpanel";

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

interface MarketingStrategiesProps {
  etIDs: number[];
  isLoading: boolean;
}

const WLMarketingSection: React.FC<MarketingStrategiesProps> = ({
  etIDs,
  isLoading,
}) => {
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const setProfile = useSetAtom(profileAtom);
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
    if (isLoading || etIDs === null) {
    }
    fetchGMs(etIDs);
  }, [etIDs]);

  useEffect(() => {
    if (
      isLoading ||
      etIDs === null ||
      orgInfo === null ||
      orgInfo.id === null
    ) {
      return;
    }

    fetchTMs(etIDs, orgInfo.id);
  }, [etIDs, orgInfo]);

  const fetchGMs = async (etIDs: number[]) => {
    if (etIDs.length === 0) {
      return;
    }

    setIsFetchingGM(true);
    setGMs(null);

    try {
      const { data, error } = await supabase
        .from("general_marketings_with_date_v1")
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
          date, 
          company_id, 
          company_name
          `
        )
        .in("earnings_transcript_id", etIDs);

      if (error) throw error;

      const strategies = data.map((item: any) => ({
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
        date: item.date,
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
        .from("tailored_marketings_with_date_v1")
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
          date, 
          company_id, 
          company_name
          `
        )
        .eq("organization_id", orgID)
        .in("earnings_transcript_id", etIDs);

      if (error) throw error;

      const companyIDs = Array.from(
        new Set(data.map((item: any) => item.company_id))
      );

      setCompanyCount(companyIDs.length);

      const marketings = data.map((item: any) => ({
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
        date: item.date,
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
      invokeToast("error", "No earnings transcripts selected");
      return;
    }

    mixpanel.track("generate.marketing", {
      $source: "watchlist_page",
    });

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

      setProfile((prev) => {
        if (!prev || !prev.credits) return prev;

        return {
          ...prev,
          credits: prev.credits - data.used_credits,
        };
      });

      setUserInfo((prev) => {
        if (!prev || !prev.creditCount) return prev;
        return {
          ...prev,
          creditCount: prev.creditCount
            ? prev.creditCount - data.used_credits
            : 0,
        };
      });
      invokeToast("success", data.message);
    } catch (error) {
      invokeToast("error", "Failed to generate tailored marketing strategies");
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

  const exportData = (data: MarketingProps[] | null) => {
    if (!data) return [];
    return data.map((item) => ({
      Tactic: item.tactic,
      "Tactic Score": item.tacticScore,
      "Company Name": item.companyName,
      "Target Personas": item.targetPersonas,
      Channel: item.channel,
      "Value Proposition": item.valueProposition,
      "Key Performance Indicators": item.keyPerformanceIndicators.join(", "),
      "Strategic Alignment": item.strategicAlignment,
      "Call to Action": item.callToAction,
    }));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-200 justify-between rounded-t-lg">
        {companyCount && companyCount > 0 ? (
          <div className="flex px-2 pt-1.5 pb-0 gap-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-3 sm:py-3 w-full sm:w-auto rounded-t-lg border border-b-0 ${
                activeTab === "general"
                  ? "text-gray-900 bg-gray-100 border-gray-300"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-100"
              }`}
            >
              General Marketing Strategy
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-3 sm:py-3 w-full sm:w-auto rounded-t-lg border border-b-0 ${
                activeTab === "tailored"
                  ? "text-gray-900 bg-gray-100 border-gray-300"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-100"
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

        <div className="flex items-center gap-2 px-2">
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
                    <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-white bg-yellow-400 rounded-full">
                      !
                    </span>
                    <div className="absolute bottom-full mb-2 z-50 hidden w-80 p-2 text-sm text-yellow-600 bg-yellow-100 border border-yellow-300 rounded-md shadow-lg group-hover:block">
                      {`Tailored marketing strategies are not generated for ${
                        etIDs.length - companyCount
                      } ${
                        etIDs.length - companyCount > 1
                          ? "companies"
                          : "company"
                      }. Please click to generate for the remaining ${
                        etIDs.length - companyCount > 1
                          ? "companies"
                          : "company"
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

          {!isFetchingGM && !isFetchingTM && (
            <CSVLink
              data={exportData(
                activeTab === "general" ? generalMarketings : tailoredMarketings
              )}
              filename={`${activeTab}_marketing_strategies.csv`}
              onClick={() => {
                mixpanel.track("export.csv", {
                  $source: "watchlist_page.marketing",
                });
              }}
              className="px-4 py-2 sm:py-2 w-full sm:w-auto rounded-md text-white text-sm border border-green-600 bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFileCsv} />
              Export as CSV
            </CSVLink>
          )}
        </div>
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
        modalClass="w-full mx-16 min-w-[60rem] xl:max-w-[50rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
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
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Tactic
              </h3>
              <p className="text-sm sm:text-base text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
                {selectedMSs?.tactic}
              </p>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Value Proposition
              </h3>
              <p className="text-sm sm:text-base text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
                {selectedMSs?.valueProposition}
              </p>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
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
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Call to Action
              </h3>
              <p className="text-sm sm:text-base text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
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
