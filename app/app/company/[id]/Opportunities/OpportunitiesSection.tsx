import { useState, useEffect } from "react";
import axios from "axios";
import { useAtomValue } from "jotai";

import Modal from "@/app/components/Modal";
import { supabase } from "@/utils/supabaseClient";
import { orgInfoAtom } from "@/utils/atoms";
import OpportunitiesTable from "./OpportunitiesTable";
import { generateTailoredOpportunitiesAPI } from "@/utils/apiClient";
import { useToastContext } from "@/contexts/toastContext";

interface OpportunitiesProps {
  companyID: number;
  companyName: string;
  year: number | null;
  quarter: number | null;
}

export interface OpportunityProps {
  opportunityName: string;
  opportunityScore: number;
  targetBuyer: {
    role: string;
    department: string;
  };
  tactics: string[];
}

const OpportunitiesSection: React.FC<OpportunitiesProps> = ({
  companyID,
  companyName,
  year,
  quarter,
}) => {
  if (!year || !quarter) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const orgInfo = useAtomValue(orgInfoAtom);
  const [etID, setETID] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityProps | null>(null);
  const [generalOpps, setGeneralOpps] = useState<OpportunityProps[] | null>(
    null
  );
  const [tailoredOpps, setTailoredOpps] = useState<OpportunityProps[] | null>(
    null
  );
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
        .select("name, score, buyer_role, buyer_department, tactics")
        .eq("earnings_transcript_id", etID);

      if (error) throw error;

      const formattedData: OpportunityProps[] = data.map((item: any) => ({
        opportunityName: item.name,
        opportunityScore: item.score,
        targetBuyer: {
          role: item.buyer_role,
          department: item.buyer_department,
        },
        tactics: item.tactics.split("\n"),
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
        .select("name, score, buyer_role, buyer_department, tactics")
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

      if (error) throw error;

      const formattedData: OpportunityProps[] = data.map((item: any) => ({
        opportunityName: item.name,
        opportunityScore: item.score,
        targetBuyer: {
          role: item.buyer_role,
          department: item.buyer_department,
        },
        tactics: item.tactics.split("\n"),
      }));
      setTailoredOpps(formattedData);
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
        quarter,
      });

      if (data.status === "success") {
        const formattedData: OpportunityProps[] = data.opportunities.map(
          (item: any) => ({
            opportunityName: item.name,
            opportunityScore: item.score,
            targetBuyer: {
              role: item.buyer_role,
              department: item.buyer_department,
            },
            tactics: item.tactics.split("\n"),
          })
        );
        setTailoredOpps(formattedData);
        setActiveTab("tailored");
        invokeToast(
          "success",
          "Tailored opportunities generated successfully",
          "top"
        );
      } else {
        invokeToast("error", data.message, "top");
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
      <div className="w-full flex items-center bg-gray-100 justify-between">
        {tailoredOpps && tailoredOpps.length > 0 && !isTailoredOppGenerating ? (
          <div className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-4 border-indigo-600 border-b-2 ${
                activeTab === "general"
                  ? "text-indigo-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              General Opportunities
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-4 border-indigo-600 border-b-2 ${
                activeTab === "tailored"
                  ? "text-indigo-600 border-opacity-100"
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
                onClick={generateTailoredOpportunities}
                disabled={isTailoredOppGenerating}
                className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 focus:outline-none transition duration-150 ease-in-out"
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

      <div className="overflow-x-auto overflow-y-auto max-h-[700px] text-sm">
        {activeTab === "general" &&
          (isGeneralOppLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-300 text-black">
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
              <div className="p-4 bg-gray-300 text-black">
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

      <Modal isOpen={!!selectedOpp} onClose={() => setSelectedOpp(null)}>
        <h4 className="text-lg font-bold mb-4">Prospecting Tactics</h4>
        <ul className="list-disc pl-5 mb-4">
          {selectedOpp?.tactics.map((tip: string, index: number) => (
            <li key={index} className="mb-2">
              {tip}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

const LoadingSection: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-44">
      <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
    </div>
  );
};

export default OpportunitiesSection;