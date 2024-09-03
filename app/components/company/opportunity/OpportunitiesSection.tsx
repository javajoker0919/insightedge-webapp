import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { supabase } from "@/utils/supabaseClient";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faFileCsv } from "@fortawesome/free-solid-svg-icons"; // Add this import

import Modal from "@/app/components/Modal";
import { profileAtom, orgInfoAtom, userInfoAtom } from "@/utils/atoms";
import OpportunitiesTable from "./OpportunitiesTable";
import { generateTOAPI } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { Loading } from "@/app/components";
import { getMixPanelClient } from "@/utils/mixpanel";

interface OpportunitiesProps {
  companyName: string;
  etID: number | null;
  setJsonGO: React.Dispatch<React.SetStateAction<any[] | null>>;
  setJsonTO: React.Dispatch<React.SetStateAction<any[] | null>>;
}

export interface OpportunityProps {
  opportunityName: string;
  opportunityScore: number;
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
  reasoning?: string;
}

const OpportunitiesSection: React.FC<OpportunitiesProps> = ({
  companyName,
  etID,
  setJsonGO,
  setJsonTO,
}) => {
  if (!etID) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const setProfile = useSetAtom(profileAtom);
  const orgInfo = useAtomValue(orgInfoAtom);
  const setUserInfo = useSetAtom(userInfoAtom);

  // const [etID, setETID] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityProps | null>(null);
  const [generalOpps, setGOs] = useState<OpportunityProps[] | null>(null);
  const [tailoredOpps, setTOs] = useState<OpportunityProps[] | null>(null);

  const [isFetchingGO, setIsFetchingGO] = useState<boolean>(true);
  const [isFetchingTO, setIsFetchingTO] = useState<boolean>(true);
  const [isGeneratingTO, setIsGeneratingTO] = useState<boolean>(false);

  useEffect(() => {
    if (etID) {
      fetchGO(etID);
    }
  }, [etID]);

  useEffect(() => {
    if (orgInfo && etID) {
      fetchTO(etID, orgInfo.id);
    }
  }, [orgInfo, etID]);

  const fetchGO = async (etID: number) => {
    setIsFetchingGO(true);
    setGOs(null);
    setJsonGO(null);

    try {
      const { data, error } = await supabase
        .from("general_opportunities")
        .select(
          "name, score, buyer_role, buyer_department, engagement_inbounds, engagement_outbounds, email_subject, email_body, reasoning"
        )
        .eq("earnings_transcript_id", etID);

      if (error) throw error;

      const formattedData: OpportunityProps[] = data.map((item: any) => ({
        opportunityName: item.name,
        opportunityScore: item.score,
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
      }));
      setGOs(formattedData);
      setJsonGO(formattedData);
    } catch (error) {
      console.error("Unexpected error in fetchGO:", error);
    } finally {
      setIsFetchingGO(false);
    }
  };

  const fetchTO = async (etID: number, orgID: number) => {
    setIsFetchingTO(true);
    setTOs(null);
    setJsonTO(null);

    try {
      const { data, error } = await supabase
        .from("tailored_opportunities")
        .select(
          "name, score, keywords, buyer_role, buyer_department, engagement_inbounds, engagement_outbounds, email_subject, email_body, reasoning"
        )
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

      if (error) throw error;

      if (data) {
        const formattedData: OpportunityProps[] = data.map(
          (item: any, indx: number) => ({
            opportunityName: item.name,
            opportunityScore: item.score,
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
          })
        );
        setTOs(formattedData);
        setJsonTO(formattedData);
      } else {
        setTOs([]);
        setJsonTO([]);
      }
    } catch (error) {
      console.error("Unexpected error in fetchTO:", error);
    } finally {
      setIsFetchingTO(false);
    }
  };

  const generateTO = async () => {
    mixpanel.track("generate.opportunity", {
      $source: "company_page",
    });

    setIsGeneratingTO(true);

    try {
      const { data } = await generateTOAPI([etID]);

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
        })
      );

      setTOs(formattedData);
      setJsonTO(formattedData);
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

  const exportToCSV = (opportunities: OpportunityProps[], filename: string) => {
    const headers = [
      { label: "Opportunity Name", key: "opportunityName" },
      { label: "Opportunity Score", key: "opportunityScore" },
      { label: "Keywords", key: "keywords" },
      { label: "Buyer Role", key: "targetBuyer.role" },
      { label: "Buyer Department", key: "targetBuyer.department" },
      { label: "Engagement Inbounds", key: "engagementTips.inbound" },
      { label: "Engagement Outbounds", key: "engagementTips.outbound" },
      { label: "Email Subject", key: "outboundEmail.subject" },
      { label: "Email Body", key: "outboundEmail.body" },
      { label: "Reasoning", key: "reasoning" },
    ];

    const csvData = opportunities.map((opp) => ({
      ...opp,
      "engagementTips.inbound": opp.engagementTips?.inbound.join("\n"),
      "engagementTips.outbound": opp.engagementTips?.outbound.join("\n"),
    }));

    return (
      <CSVLink
        data={csvData}
        headers={headers}
        filename={filename}
        onClick={() => {
          mixpanel.track("export.csv", {
            $source: "company_page.opportunity",
          });
        }}
        className="px-4 py-2 sm:py-2 w-40 sm:w-40 rounded-md text-white text-sm border border-green-600 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
      >
        <FontAwesomeIcon icon={faFileCsv} />
        Export as CSV
      </CSVLink>
    );
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-200 justify-between">
        {tailoredOpps && tailoredOpps.length > 0 && !isGeneratingTO ? (
          <div className="flex px-2 pt-1.5 pb-0 gap-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-3 sm:py-3 w-full sm:w-auto rounded-t-lg border border-b-0 ${
                activeTab === "general"
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-100"
              }`}
            >
              General Opportunities
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-3 sm:py-3 w-full sm:w-auto rounded-t-lg border border-b-0 ${
                activeTab === "tailored"
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-700 bg-gray-200 hover:bg-gray-100"
              }`}
            >
              Tailored Opportunities
            </button>
          </div>
        ) : (
          <div className="flex w-full justify-between items-center pr-4 py-1">
            <h3 className="px-4 py-3 font-medium text-gray-700">
              Opportunities
            </h3>
          </div>
        )}

        <div className="flex items-center gap-2 px-2">
          {!isFetchingTO && tailoredOpps && tailoredOpps.length === 0 && (
            <button
              title={`Discover the top opportunities for selling your solutions to ${companyName}`}
              onClick={generateTO}
              disabled={isGeneratingTO}
              className="px-4 py-2 w-72 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
            >
              {isGeneratingTO ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              ) : (
                "Generate Tailored Opportunities"
              )}
            </button>
          )}
          {activeTab === "general" && generalOpps && (
            <div className="ml-auto">
              {exportToCSV(
                generalOpps,
                `${companyName}_general_opportunities.csv`
              )}
            </div>
          )}
          {activeTab === "tailored" && tailoredOpps && (
            <div className="ml-auto">
              {exportToCSV(
                tailoredOpps,
                `${companyName}_tailored_opportunities.csv`
              )}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
        {activeTab === "general" &&
          (isFetchingGO ? (
            <LoadingSection />
          ) : (
            <>
              {/* <div className="p-4 bg-white text-black min-w-[1200px]">
                {companyName}'s top opportunities.
                {tailoredOpps?.length === 0 && (
                  <span>
                    To find the best ways to sell your solutions to{" "}
                    {companyName}, click "Generate Tailored Opportunities."
                  </span>
                )}
              </div> */}
              {generalOpps && (
                <OpportunitiesTable
                  companyName={companyName}
                  opportunities={generalOpps}
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
              {/* <div className="p-4 bg-white text-black min-w-[1200px]">
                Below is your company specific opportunity table. You can
                explore the top sales opportunities for selling your solutions
                to {companyName}
              </div> */}
              {tailoredOpps && (
                <OpportunitiesTable
                  companyName={companyName}
                  opportunities={tailoredOpps}
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
        <div className="p-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-600">
              Prospecting Tactics
            </h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Inbound Strategies
              </h3>
              <ul className="list-disc pl-8 space-y-3">
                {selectedOpp?.engagementTips?.inbound.map(
                  (tip: string, index: number) => (
                    <li key={`engagementTips_inbound_${index}`}>
                      <p className="text-gray-700">{tip}</p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Outbound Strategies
              </h3>
              <ul className="list-disc pl-8 space-y-3">
                {selectedOpp?.engagementTips?.outbound.map(
                  (tip: string, index: number) => (
                    <li key={`engagementTips_outbound_${index}`}>
                      <p className="text-gray-700">{tip}</p>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Outbound Email
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  {selectedOpp?.outboundEmail?.subject}
                </h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedOpp?.outboundEmail?.body}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-primary-600 pb-2">
                Reasoning
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{selectedOpp?.reasoning}</p>
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

export default OpportunitiesSection;
