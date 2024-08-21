import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { supabase } from "@/utils/supabaseClient";

import Modal from "@/app/components/Modal";
import { orgInfoAtom, userInfoAtom } from "@/utils/atoms";
import OpportunitiesTable from "./OpportunitiesTable";
import { generateTailoredOpportunitiesAPI } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { Details } from "../../../app/company/[id]/components";
import { Loading } from "@/app/components";

interface OpportunitiesProps {
  companyID: number;
  companyName: string;
  year: number | null;
  quarter: number | null;
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
  companyID,
  companyName,
  year,
  quarter
}) => {
  if (!year || !quarter) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const orgInfo = useAtomValue(orgInfoAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const [etID, setETID] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityProps | null>(null);
  const [generalOpps, setGeneralOpps] = useState<OpportunityProps[] | null>(
    null
  );
  const [tailoredOpps, setTailoredOpps] = useState<OpportunityProps[] | null>(
    null
  );
  const [openedSection, setOpenedSection] = useState<1 | 2 | 3>(1);
  const [isGeneralOppLoading, setIsGeneralOppLoading] =
    useState<boolean>(false);
  const [isTailoredOppLoading, setIsTailoredOppLoading] =
    useState<boolean>(false);
  const [isTailoredOppGenerating, setIsTailoredOppGenerating] =
    useState<boolean>(false);

  useEffect(() => {
    setIsGeneralOppLoading(true);
    setIsTailoredOppLoading(true);

    setGeneralOpps(null);
    setTailoredOpps(null);
    fetchETID(companyID);
  }, [year, quarter]);

  useEffect(() => {
    if (etID) {
      fetchGeneralOpportunities(etID);
    }
  }, [etID]);

  useEffect(() => {
    if (orgInfo && etID) {
      fetchTailoredOpportunities(etID, orgInfo.id);
    }
  }, [orgInfo, etID]);

  const fetchETID = async (companyID: number) => {
    try {
      const { data, error } = await supabase
        .from("earnings_transcripts")
        .select("id")
        .eq("company_id", companyID)
        .eq("year", year)
        .eq("quarter", quarter)
        .single();

      if (error) throw error;

      setETID(data.id);
    } catch (error) {
      console.error("Unexpected error in fetchETID:", error);
    }
  };

  const fetchGeneralOpportunities = async (etID: number) => {
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
          department: item.buyer_department
        },
        engagementTips: {
          inbound: item.engagement_inbounds?.split("\n") || [],
          outbound: item.engagement_outbounds?.split("\n") || []
        },
        outboundEmail: {
          subject: item.email_subject,
          body: item.email_body
        },
        reasoning: item.reasoning
      }));
      setGeneralOpps(formattedData);
    } catch (error) {
      console.error("Unexpected error in fetchGeneralOpportunities:", error);
    } finally {
      setIsGeneralOppLoading(false);
    }
  };

  const fetchTailoredOpportunities = async (etID: number, orgID: number) => {
    try {
      const { data, error } = await supabase
        .from("tailored_opportunities")
        .select(
          "name, score, keywords, buyer_role, buyer_department, tactics, engagement_inbounds, engagement_outbounds, email_subject, email_body, reasoning"
        )
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

      if (error) throw error;

      if (data) {
        // added mock data : tailoredOpportunities_v2
        const formattedData: OpportunityProps[] = data.map(
          (item: any, indx: number) => ({
            // ...tailoredOpportunities_v2[indx % tailoredOpportunities_v2.length],
            opportunityName: item.name,
            opportunityScore: item.score,
            keywords: item.keywords,
            targetBuyer: {
              role: item.buyer_role,
              department: item.buyer_department
            },
            engagementTips: {
              inbound: item.engagement_inbounds?.split("\n") || [],
              outbound: item.engagement_outbounds?.split("\n") || []
            },
            outboundEmail: {
              subject: item.email_subject,
              body: item.email_body
            },
            reasoning: item.reasoning
          })
        );
        setTailoredOpps(formattedData);
      } else {
        setTailoredOpps([]);
      }
    } catch (error) {
      console.error("Unexpected error in fetchTailoredOpportunities:", error);
    } finally {
      setIsTailoredOppLoading(false);
    }
  };

  const generateTailoredOpportunities = async () => {
    setIsTailoredOppGenerating(true);

    try {
      const { data } = await generateTailoredOpportunitiesAPI({
        companyID: companyID.toString(),
        orgID: orgInfo?.id.toString() || "",
        year,
        quarter
      });

      if (data.status === "success") {
        const formattedData: OpportunityProps[] = data.opportunities.map(
          (item: any) => ({
            opportunityName: item.name,
            opportunityScore: item.score,
            keywords: item.keywords.split("\n"),
            targetBuyer: {
              role: item.buyer_role,
              department: item.buyer_department
            },
            engagementTips: {
              inbound: item.engagement_inbounds.split("\n"),
              outbound: item.engagement_outbounds.split("\n")
            },
            outboundEmail: {
              subject: item.email_subject,
              body: item.email_body
            }
          })
        );
        setTailoredOpps(formattedData);
        setActiveTab("tailored");
        setUserInfo((prev) => {
          if (!prev || !prev.creditCount) return prev;
          return {
            ...prev,
            creditCount: prev.creditCount ? prev.creditCount - 1 : 0
          };
        });
        invokeToast("success", data.message, "top");
      } else {
        invokeToast(
          "error",
          "An error occured while generating tailored opportunities",
          "top"
        );
      }
    } catch (error) {
      invokeToast("error", "Failred to generate tailored opportunities", "top");
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
      setIsTailoredOppGenerating(false);
    }
  };

  const handleQuickAction = (opp: OpportunityProps) => {
    setSelectedOpp(opp);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        {tailoredOpps && tailoredOpps.length > 0 && !isTailoredOppGenerating ? (
          <div className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-4 border-primary-600 border-b-2 ${
                activeTab === "general"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              General Opportunities
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-4 border-primary-600 border-b-2 ${
                activeTab === "tailored"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
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
            {!isGeneralOppLoading && !isTailoredOppLoading && (
              <button
                title={`Discover the top opportunities for selling your solutions to ${companyName}`}
                onClick={generateTailoredOpportunities}
                disabled={isTailoredOppGenerating}
                className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
              >
                {isTailoredOppGenerating ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                ) : (
                  "Generate Tailored Opportunities"
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
        {activeTab === "general" &&
          (isGeneralOppLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black min-w-[1200px]">
                {companyName}'s top opportunities.
                {tailoredOpps?.length === 0 && (
                  <span>
                    To find the best ways to sell your solutions to{" "}
                    {companyName}, click "Generate Tailored Opportunities."
                  </span>
                )}
              </div>
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
          (isTailoredOppLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black">
                Below is your company specific opportunity table. You can
                explore the top sales opportunities for selling your solutions
                to {companyName}
              </div>
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
        modalClass="w-full mx-16 min-w-[60rem] xl:min-w-[80rem] xl:max-w-full max-h-[90vh] overflow-y-auto"
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Outbound Email
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  {selectedOpp?.outboundEmail?.subject}
                </h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedOpp?.outboundEmail?.body}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Reasoning
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
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
