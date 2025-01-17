"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faFileCsv } from "@fortawesome/free-solid-svg-icons"; // Add this import

import { supabase } from "@/utils/supabaseClient";
import Modal from "@/app/components/Modal";
import OpportunitiesTable from "./WLOpportunityTable";
import { useToastContext } from "@/contexts/toastContext";
import { Loading } from "@/app/components";
import { generateTOAPI } from "@/utils/apiClient";
import { orgInfoAtom, creditCountAtom } from "@/utils/atoms";
import { getMixPanelClient } from "@/utils/mixpanel";

export interface OpportunityProps {
  opportunityName: string;
  opportunityScore: number;
  companyName: string;
  keywords?: string[];
  targetBuyer: {
    role: string;
    department: string;
  };
  engagementTips?: {
    inbound: string[];
    outbound: string[];
  };
  outboundEmail?: {
    subject: string;
    body: string;
  };
  reasoning: string;
  date: string;
}

interface OpportunitiesProps {
  etIDs: number[];
  isLoading: boolean;
}

const WLOpportunitySection: React.FC<OpportunitiesProps> = ({
  etIDs,
  isLoading,
}) => {
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const orgInfo = useAtomValue(orgInfoAtom);
  const setCreditCount = useSetAtom(creditCountAtom);

  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityProps | null>(null);
  const [generalOpportunities, setGOs] = useState<OpportunityProps[] | null>(
    null
  );
  const [tailoredOpportunities, setTOs] = useState<OpportunityProps[] | null>(
    null
  );

  const [isFetchingGO, setIsFetchingGO] = useState<boolean>(true);
  const [isFetchingTO, setIsFetchingTO] = useState<boolean>(true);
  const [isGeneratingTO, setIsGeneratingTO] = useState<boolean>(false);

  const [companyCount, setCompanyCount] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    fetchGOs(etIDs);
  }, [etIDs]);

  useEffect(() => {
    if (isLoading || orgInfo === null || orgInfo.id === null) {
      return;
    }

    fetchTOs(etIDs, orgInfo.id);
  }, [etIDs, orgInfo]);

  const fetchGOs = async (etIDs: number[]) => {
    if (etIDs.length === 0) {
      return;
    }

    setIsFetchingGO(true);
    setGOs(null);

    try {
      const { data, error } = await supabase
        .from("general_opportunities_with_date_v1")
        .select(
          `
          name, 
          score, 
          buyer_role, 
          buyer_department, 
          engagement_inbounds, 
          engagement_outbounds, 
          email_subject, 
          email_body,
          reasoning,
          date,
          company_id,
          company_name
          `
        )
        .in("earnings_transcript_id", etIDs);

      if (error) throw error;

      const formattedData: OpportunityProps[] = data.map((item) => ({
        opportunityName: item.name,
        opportunityScore: item.score,
        companyName: item.company_name,
        targetBuyer: {
          role: item.buyer_role,
          department: item.buyer_department,
        },
        engagementTips: {
          inbound: item.engagement_inbounds?.split("\n") || [],
          outbound: item.engagement_outbounds?.split("\n") || [],
        },
        outboundEmail: {
          subject: item.email_subject,
          body: item.email_body,
        },
        reasoning: item.reasoning,
        date: item.date,
      }));

      setGOs(formattedData);
    } catch (error) {
      console.error("Unexpected error in fetchGOs:", error);
    } finally {
      setIsFetchingGO(false);
    }
  };

  const fetchTOs = async (etIDs: number[], orgID: number) => {
    if (etIDs.length === 0) {
      return;
    }

    setIsFetchingTO(true);
    setTOs(null);
    setCompanyCount(null);

    try {
      const { data, error } = await supabase
        .from("tailored_opportunities_with_date_v1")
        .select(
          `
          name, 
          score, 
          buyer_role, 
          buyer_department, 
          engagement_inbounds, 
          engagement_outbounds, 
          email_subject, 
          email_body,
          reasoning,
          keywords,
          date,
          company_id,
          company_name
          `
        )
        .eq("organization_id", orgID)
        .in("earnings_transcript_id", etIDs);

      if (error) throw error;

      const companyIDs = Array.from(
        new Set(data.map((item) => item.company_id))
      );

      setCompanyCount(companyIDs.length);

      if (data) {
        const formattedData: OpportunityProps[] = data.map((item) => ({
          opportunityName: item.name,
          opportunityScore: item.score,
          companyName: item.company_name,
          keywords: item.keywords,
          targetBuyer: {
            role: item.buyer_role,
            department: item.buyer_department,
          },
          engagementTips: {
            inbound: item.engagement_inbounds?.split("\n") || [],
            outbound: item.engagement_outbounds?.split("\n") || [],
          },
          outboundEmail: {
            subject: item.email_subject,
            body: item.email_body,
          },
          reasoning: item.reasoning,
          date: item.date,
        }));

        setTOs(formattedData);
      } else {
        setTOs([]);
      }
    } catch (error) {
      console.error("Unexpected error in fetchTOs:", error);
    } finally {
      setIsFetchingTO(false);
    }
  };

  const generateTOs = async () => {
    if (!etIDs || etIDs.length === 0) {
      invokeToast("error", "No earnings transcripts selected");
      return;
    }

    mixpanel.track("generate.opportunity", {
      $source: "Watchlist_page",
    });

    setIsGeneratingTO(true);

    try {
      const { data } = await generateTOAPI(etIDs);

      const formattedData: OpportunityProps[] = data.opportunities.map(
        (item: any) => ({
          opportunityName: item.name,
          opportunityScore: item.score,
          companyName: item.company_name,
          keywords: item.keywords?.split(",") || [],
          targetBuyer: {
            role: item.buyer_role,
            department: item.buyer_department,
          },
          engagementTips: {
            inbound: item.engagement_inbounds?.split("\n") || [],
            outbound: item.engagement_outbounds?.split("\n") || [],
          },
          outboundEmail: {
            subject: item.email_subject,
            body: item.email_body,
          },
          reasoning: item.reasoning,
          date: "",
        })
      );

      // Calculate unique company name count
      const uniqueCompanyNames = new Set(
        formattedData.map((item) => item.companyName)
      );

      setCompanyCount(uniqueCompanyNames.size);
      setTOs(formattedData);
      setActiveTab("tailored");
      setCreditCount((prev) => (prev ? prev - data.used_credits : null));

      invokeToast("success", data.message);
    } catch (error) {
      invokeToast("error", "Failed to generate tailored opportunities");
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
      setIsGeneratingTO(false);
    }
  };

  const handleQuickAction = (opp: OpportunityProps) => {
    setSelectedOpp(opp);
  };

  const exportToCSV = () => {
    const headers = [
      { label: "Opportunity Name", key: "opportunityName" },
      { label: "Opportunity Score", key: "opportunityScore" },
      { label: "Company Name", key: "companyName" },
      { label: "Keywords", key: "keywords" },
      { label: "Buyer Role", key: "targetBuyer.role" },
      { label: "Buyer Department", key: "targetBuyer.department" },
      { label: "Inbound Engagement Tips", key: "engagementTips.inbound" },
      { label: "Outbound Engagement Tips", key: "engagementTips.outbound" },
      { label: "Email Subject", key: "outboundEmail.subject" },
      { label: "Email Body", key: "outboundEmail.body" },
      { label: "Reasoning", key: "reasoning" },
      { label: "Date", key: "date" },
    ];

    const data =
      activeTab === "general" ? generalOpportunities : tailoredOpportunities;

    return {
      headers,
      data: data || [],
    };
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
              General Opportunities
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-3 sm:py-3 w-full sm:w-auto rounded-t-lg border border-b-0 ${
                activeTab === "tailored"
                  ? "text-gray-900 bg-gray-100 border-gray-300"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-100"
              }`}
            >
              Tailored Opportunities
            </button>
          </div>
        ) : (
          <div className="p-4">
            <p className="font-medium text-gray-700">Opportunities</p>
          </div>
        )}

        <div className="flex items-center gap-2 px-2">
          {isFetchingTO || companyCount === null ? (
            <></>
          ) : companyCount === etIDs.length ? (
            <></>
          ) : (
            <div className="p-2">
              {isGeneratingTO ? (
                <button className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out">
                  <Loading size={5} color="white" />
                </button>
              ) : companyCount === 0 ? (
                <button
                  onClick={generateTOs}
                  className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  <span>Generate Tailored Opportunities</span>
                </button>
              ) : companyCount < etIDs.length ? (
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-white bg-yellow-400 rounded-full">
                      !
                    </span>
                    <div className="absolute bottom-full mb-2 z-50 hidden w-72 p-2 text-sm text-yellow-600 bg-yellow-100 border border-yellow-300 rounded-md shadow-lg group-hover:block">
                      {`Tailored opportunities are not generated for ${
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
                    onClick={generateTOs}
                    className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
                  >
                    <span className="flex items-center gap-1">
                      {`Update Tailored Opportunities (${
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

          {!isFetchingGO && !isFetchingTO && (
            <CSVLink
              {...exportToCSV()}
              filename={`${activeTab}_opportunities.csv`}
              onClick={() => {
                mixpanel.track("export.csv", {
                  $source: "watchlist_page.opportunity",
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
          (isFetchingGO ? (
            <LoadingSection />
          ) : (
            <>
              {generalOpportunities && (
                <OpportunitiesTable
                  opportunities={generalOpportunities}
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
        {activeTab === "tailored" &&
          (isFetchingTO ? (
            <LoadingSection />
          ) : (
            <>
              {tailoredOpportunities && (
                <OpportunitiesTable
                  opportunities={tailoredOpportunities}
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
      </div>

      <Modal
        wrapperClass="backdrop-blur-[2px]"
        modalClass="w-full mx-16 min-w-[60rem] xl:max-w-[50rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
        isOpen={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
      >
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary-600">
              Prospecting Tactics
            </h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Inbound Strategies
              </h3>
              <ul className="list-disc pl-5 sm:pl-8 space-y-3">
                {selectedOpp?.engagementTips?.inbound.map(
                  (tip: string, index: number) => (
                    <li key={`engagementTips_inbound_${index}`}>
                      <p className="text-sm sm:text-base text-gray-700">
                        {tip}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Outbound Strategies
              </h3>
              <ul className="list-disc pl-5 sm:pl-8 space-y-3">
                {selectedOpp?.engagementTips?.outbound.map(
                  (tip: string, index: number) => (
                    <li key={`engagementTips_outbound_${index}`}>
                      <p className="text-sm sm:text-base text-gray-700">
                        {tip}
                      </p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Outbound Email
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                  {selectedOpp?.outboundEmail?.subject}
                </h4>
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
                  {selectedOpp?.outboundEmail?.body}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Reasoning
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <p className="text-sm sm:text-base text-gray-700">
                  {selectedOpp?.reasoning}
                </p>
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

export default WLOpportunitySection;
