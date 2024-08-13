"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/utils/supabaseClient";

import Modal from "@/app/components/Modal";
import OpportunitiesTable from "./WLOpportunityTable";
import { useToastContext } from "@/contexts/toastContext";
import { Details } from "../..";
import { tailoredOpportunities_v2 } from "@/app/app/company/[id]/Constants";

interface OpportunitiesProps {
  companyName?: string;
  etIDs: number[] | null;
}

export interface OpportunityProps {
  opportunityName: string;
  opportunityScore: number;
  companyName: string;
  keywords?: string[];
  targetBuyer: {
    role: string;
    department: string;
  };
  tactics?: string[];
  engagementTips?: {
    inbound: string[];
    outbound: string[];
  };
  outboundEmail?: {
    subject: string;
    body: string;
  };
}

const WLOpportunitySection: React.FC<OpportunitiesProps> = ({
  companyName,
  etIDs,
}) => {
  const { invokeToast } = useToastContext();
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityProps | null>(null);
  const [generalOpps, setGeneralOpps] = useState<OpportunityProps[] | null>(
    null
  );
  const [tailoredOpps, setTailoredOpps] = useState<OpportunityProps[] | null>(
    null
  );
  const [openedSection, setOpenedSection] = useState<1 | 2 | 3>(1);
  const [isGOLoading, setIsGOLoading] = useState<boolean>(true);
  const [isTOLoading, setIsTOLoading] = useState<boolean>(false);
  const [isTOGenerating, setIsTOGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (etIDs && etIDs.length > 0) {
      fetchGeneralOpportunities(etIDs);
    }
  }, [etIDs]);

  const fetchGeneralOpportunities = async (etIDs: number[]) => {
    try {
      setIsGOLoading(true);

      const { data, error } = await supabase
        .from("general_opportunities")
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

      const formattedData: OpportunityProps[] = data.map((item: any) => ({
        opportunityName: item.name,
        opportunityScore: item.score,
        companyName: companyMap[item.earnings_transcripts.company_id],
        targetBuyer: {
          role: item.buyer_role,
          department: item.buyer_department,
        },
        tactics: item.tactics?.split("\n"),
        engagementTips: {
          inbound: item.engagement_inbounds?.split("\n") || [],
          outbound: item.engagement_outbounds?.split("\n") || [],
        },
        outboundEmail: {
          subject: item.email_subject,
          body: item.email_body,
        },
      }));

      setGeneralOpps(formattedData);
    } catch (error) {
      console.error("Unexpected error in fetchGeneralOpportunities:", error);
    } finally {
      setIsGOLoading(false);
    }
  };

  const fetchTailoredOpportunities = async (etID: number, orgID: number) => {
    try {
      setIsTOLoading(true);

      const { data, error } = await supabase
        .from("tailored_opportunities")
        .select(
          `
          name, 
          score, 
          keywords, 
          buyer_role, 
          buyer_department, 
          tactics, 
          engagement_inbounds, 
          engagement_outbounds, 
          email_subject, 
          email_body,
          earnings_transcripts (
            company_id
          )
          `
        )
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

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

      if (data) {
        const formattedData: OpportunityProps[] = data.map(
          (item: any, indx: number) => ({
            opportunityName: item.name,
            opportunityScore: item.score,
            companyName: companyMap[item.earnings_transcripts.company_id],
            keywords: item.keywords,
            targetBuyer: {
              role: item.buyer_role,
              department: item.buyer_department,
            },
            tactics: item.tactics?.split("\n") || [],
            engagementTips: {
              inbound: item.engagement_inbounds?.split("\n") || [],
              outbound: item.engagement_outbounds?.split("\n") || [],
            },
            outboundEmail: {
              subject: item.email_subject,
              body: item.email_body,
            },
          })
        );
        setTailoredOpps(formattedData);
      } else {
        setTailoredOpps([]);
      }
    } catch (error) {
      console.error("Unexpected error in fetchTailoredOpportunities:", error);
    } finally {
      setIsTOLoading(false);
    }
  };

  const generateTailoredOpportunities = async () => {
    setIsTOGenerating(true);

    try {
      setTimeout(() => {
        setTailoredOpps(tailoredOpportunities_v2);
      }, 2500);
    } catch (error) {
      invokeToast("error", "Failed to generate tailored opportunities", "top");
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
      setIsTOGenerating(false);
    }
  };

  const handleQuickAction = (opp: OpportunityProps) => {
    setSelectedOpp(opp);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        {tailoredOpps && tailoredOpps.length > 0 && !isTOGenerating ? (
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
            {!isGOLoading && !isTOLoading && (
              <button
                onClick={generateTailoredOpportunities}
                disabled={isTOGenerating}
                className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
              >
                {isTOGenerating ? (
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
          (isGOLoading ? (
            <LoadingSection />
          ) : (
            <>
              {companyName && (
                <div className="p-4 bg-gray-100 text-black">
                  {companyName}'s top opportunities.
                  {tailoredOpps?.length === 0 && (
                    <span>
                      To find the best ways to sell your solutions to{" "}
                      {companyName}, click "Generate Tailored Opportunities."
                    </span>
                  )}
                </div>
              )}
              {generalOpps && (
                <OpportunitiesTable
                  companyName={companyName ?? "companyName"}
                  opportunities={generalOpps}
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
        {activeTab === "tailored" &&
          (isTOLoading ? (
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
                  companyName={companyName ?? "companyName"}
                  opportunities={tailoredOpps}
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
      </div>

      <Modal
        wrapperClass="backdrop-blur-[2px]"
        modalClass="min-w-[555px] max-w-full"
        isOpen={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-primary-600">
            Prospecting Tactics
          </h4>
        </div>
        <Details
          key={"stratagy-1-" + (openedSection === 1 ? "open" : "close")}
          open={openedSection === 1}
          onToggle={(open) => open && setOpenedSection(1)}
          title="Inbound Strategies"
          wrapperClass="border-primary-600 bg-[#f5f5ff]"
          headClass="hover:bg-[#f5f5ff] text-gray-800"
        >
          <ul className="list-disc pl-8 mb-4 text-gray-600">
            {selectedOpp?.engagementTips?.inbound.map(
              (tip: string, index: number) => (
                <li key={"engagementTips_inbound_" + index} className="mb-2">
                  {tip}
                </li>
              )
            )}
          </ul>
        </Details>
        <Details
          key={"stratagy-2-" + (openedSection === 2 ? "open" : "close")}
          open={openedSection === 2}
          onToggle={(open) => open && setOpenedSection(2)}
          title="Outbound Strategies"
          wrapperClass="border-primary-600 bg-[#f5f5ff]"
          headClass="hover:bg-[#f5f5ff] text-gray-800"
        >
          <ul className="list-disc pl-8 mb-4 text-gray-600">
            {selectedOpp?.engagementTips?.outbound.map(
              (tip: string, index: number) => (
                <li key={"engagementTips_outbound_" + index} className="mb-2">
                  {tip}
                </li>
              )
            )}
          </ul>
        </Details>
        <Details
          key={"stratagy-3-" + (openedSection === 3 ? "open" : "close")}
          open={openedSection === 3}
          onToggle={(open) => open && setOpenedSection(3)}
          title="Outbound Email"
          wrapperClass="border-primary-600 bg-[#f5f5ff]"
          headClass="hover:bg-[#f5f5ff] text-gray-800"
        >
          <div className="px-3 pb-3 pt-2">
            <h4 className="text-lg font-semibold text-gray-600 mb-3">
              {selectedOpp?.outboundEmail?.subject}
            </h4>
            <p className="text-gray-600">{selectedOpp?.outboundEmail?.body}</p>
          </div>
        </Details>
      </Modal>
    </div>
  );
};

const LoadingSection: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-44">
      <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
    </div>
  );
};

export default WLOpportunitySection;
