import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue } from "jotai";

import Modal from "@/app/components/Modal";
import { supabase } from "@/utils/supabaseClient";
import { orgInfoAtom } from "@/utils/atoms";
import OpportunitiesTable from "./OpportunitiesTable";
import { generateTailoredOpportunitiesAPI } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";
import { tailoredOpportunities_v2 } from "@/app/app/company/[id]/Constants";
import { Details } from "@/app/app/company/[id]/components";

interface OpportunitiesProps {
  companyID: number;
  watchlistName: string;
  year: number | null;
  quarter: number | null;
}

export interface OpportunityProps {
  opportunityName: string;
  companyName: string;
  opportunityScore: number;
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

const OpportunitiesSection: React.FC<OpportunitiesProps> = ({
  companyID,
  watchlistName,
  year,
  quarter,
}) => {
  if (!year || !quarter) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const orgInfo = useAtomValue(orgInfoAtom);
  const [etID, setETID] = useState<number | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityProps | null>(null);

  const [tailoredOpps, setTailoredOpps] = useState<OpportunityProps[] | null>(
    null
  );
  const [openedSection, setOpenedSection] = useState<1 | 2 | 3>(1);

  const [isTailoredOppLoading, setIsTailoredOppLoading] =
    useState<boolean>(false);
  const [isTailoredOppGenerating, setIsTailoredOppGenerating] =
    useState<boolean>(false);

  useEffect(() => {
    setTailoredOpps(null);
    fetchETID(companyID);
  }, [year, quarter]);

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

  const fetchTailoredOpportunities = async (etID: number, orgID: number) => {
    try {
      const { data, error } = await supabase
        .from("tailored_opportunities")
        .select(
          "name, score, keywords, buyer_role, buyer_department, tactics, engagement_inbounds, engagement_outbounds, email_subject, email_body"
        )
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

      if (error) throw error;

      if (data) {
        const formattedData: OpportunityProps[] = data.map(
          (item: any, indx: number) => ({
            ...tailoredOpportunities_v2[indx % tailoredOpportunities_v2.length],
            opportunityName: item.name,
            opportunityScore: item.score,
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
      setTailoredOpps([]);
    } finally {
      setIsTailoredOppLoading(false);
    }
  };

  const generateTailoredOpportunities = async () => {
    setIsTailoredOppGenerating(true);

    try {
      if (orgInfo && etID) {
        fetchTailoredOpportunities(etID, orgInfo.id);
      }
      const { data } = await generateTailoredOpportunitiesAPI({
        companyID: companyID.toString(),
        orgID: orgInfo?.id.toString() || "",
        year,
        quarter,
      });

      if (data.status === "success") {
        const formattedData: OpportunityProps[] = data.opportunities.map(
          (item: any, indx: number) => ({
            ...tailoredOpportunities_v2[indx % tailoredOpportunities_v2.length],
            opportunityName: item.name,
            opportunityScore: item.score,
            keywords: item.keywords.split("\n"),
            targetBuyer: {
              role: item.buyer_role,
              department: item.buyer_department,
            },
            tactics: item.tactics?.split("\n"),
            engagementTips: {
              inbound: item.engagement_inbounds.split("\n"),
              outbound: item.engagement_outbounds.split("\n"),
            },
            outboundEmail: {
              subject: item.email_subject,
              body: item.email_body,
            },
          })
        );
        setTailoredOpps(formattedData);

        invokeToast(
          "success",
          "Tailored opportunities generated successfully",
          "top"
        );
      } else {
        invokeToast(
          "error",
          "An error occured while generating tailored opportunities",
          "top"
        );
      }
    } catch (error) {
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
        <div className="flex w-full justify-between items-center pr-4 py-1">
          <h3 className="px-4 py-3 font-medium text-gray-700">Opportunities</h3>
          {!isTailoredOppLoading &&
            !(Array.isArray(tailoredOpps) && tailoredOpps?.length > 0) && (
              <button
                title={`Discover the top opportunities for selling your solutions to ${watchlistName}`}
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
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
        {isTailoredOppLoading ? (
          <LoadingSection />
        ) : (
          <>
            <div className="p-4 bg-gray-100 text-black">
              Below is your watchlist specific opportunity table. You can
              explore the top sales opportunities for selling your solutions to{" "}
              "{watchlistName}"
            </div>
            {Array.isArray(tailoredOpps) && (
              <OpportunitiesTable
                companyName={watchlistName}
                opportunities={tailoredOpps}
                onQuickAction={handleQuickAction}
              />
            )}
          </>
        )}
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

export default OpportunitiesSection;
