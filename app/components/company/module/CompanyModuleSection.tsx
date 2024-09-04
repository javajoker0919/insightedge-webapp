import { useEffect, useState } from "react";

import { useToastContext } from "@/contexts/toastContext";
import { supabase } from "@/utils/supabaseClient";
import { profileAtom, creditCountAtom } from "@/utils/atoms";

import CompanyModuleOpportunitySection from "./opportunity/CompanyModuleOpportunitySection";
import { OpportunityProps } from "@/app/components/interface";
import { useAtom, useAtomValue } from "jotai";
import { getMixPanelClient } from "@/utils/mixpanel";
import { generateTOAPI } from "@/utils/apiClient";

interface CompanyModuleSectionProps {
  companyName: string;
  etID: number | null;
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  onClick,
  children,
}) => {
  return (
    <button
      className={`py-2 px-4 ${
        isActive ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const CompanyModuleSection: React.FC<CompanyModuleSectionProps> = ({
  companyName,
  etID,
}) => {
  if (etID == null) {
    return null;
  }

  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const profile = useAtomValue(profileAtom);
  const [creditCount, setCreditCount] = useAtom(creditCountAtom);

  const [activeTab, setActiveTab] = useState("Opportunity");

  /// General Opportunity
  const [GOs, setGOs] = useState<OpportunityProps[] | null>(null);
  const [isFetchingGO, setIsFetchingGO] = useState<boolean>(false);

  /// Tailored Opportunity
  const [TOs, setTOs] = useState<OpportunityProps[] | null>(null);
  const [isFetchingTO, setIsFetchingTO] = useState<boolean>(false);
  const [isGeneratingTO, setIsGeneratingTO] = useState<boolean>(false);

  useEffect(() => {
    fetchGO(etID);
  }, [etID]);

  useEffect(() => {
    if (profile && profile.org_id) {
      fetchTO(etID, profile.org_id);
    }
  }, [etID, profile]);

  const fetchGO = async (etID: number) => {
    setIsFetchingGO(true);

    try {
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
          reasoning,
          keywords
          `
        )
        .eq("earnings_transcript_id", etID);

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch general opportunities: ${error.message}`
        );
      } else if (data && data.length > 0) {
        const formattedData: OpportunityProps[] = data.map((item) => ({
          companyName: companyName,
          name: item.name,
          score: item.score,
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
          keywords: item.keywords,
        }));

        setGOs(formattedData);
      } else {
        setGOs(null);
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch general opportunities: ${error}`);
      console.error(`Failed to fetch general opportunities: ${error}`);
    } finally {
      setIsFetchingGO(false);
    }
  };

  const fetchTO = async (etID: number, orgID: number) => {
    setIsFetchingTO(true);

    try {
      const { data, error } = await supabase
        .from("tailored_opportunities")
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
          keywords
          `
        )
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch tailored opportunities: ${error.message}`
        );
      } else if (data && data.length > 0) {
        const formattedData: OpportunityProps[] = data.map((item) => ({
          companyName: companyName,
          name: item.name,
          score: item.score,
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
          keywords: item.keywords,
        }));

        setTOs(formattedData);
      } else {
        setTOs(null);
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch tailored opportunities: ${error}`);
      console.error(`Failed to fetch tailored opportunities: ${error}`);
    } finally {
      setIsFetchingTO(false);
    }
  };

  const handleGenerateTO = () => {
    mixpanel.track("generate.opportunity", {
      $source: "company_page",
    });

    generateTO(etID);
  };

  const generateTO = async (etID: number) => {
    setIsGeneratingTO(true);

    try {
      const { data } = await generateTOAPI([etID]);

      if (data && data.opportunities && data.opportunities.length > 0) {
        const formattedData: OpportunityProps[] = data.opportunities.map(
          (item: any) => ({
            companyName: item.company_name,
            name: item.name,
            score: item.score,
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
            keywords: item.keywords?.split(",") || [],
          })
        );

        setTOs(formattedData);
      } else {
        setTOs(null);
      }

      setActiveTab("tailored");
      invokeToast("success", data.message);

      setCreditCount((prev) => (prev ? prev - 1 : null));
    } catch (error) {
      invokeToast(
        "error",
        `Failed to generate tailored opportunities: ${error}`
      );
      console.error(`Failed to generate tailored opportunities: ${error}`);
    } finally {
      setIsGeneratingTO(false);
    }
  };

  return (
    <div className="w-full border rounded">
      <div className="tabs flex justify-start border-b-2 border-gray-200">
        <TabButton
          isActive={activeTab === "Opportunity"}
          onClick={() => setActiveTab("Opportunity")}
        >
          Opportunity
        </TabButton>
        <TabButton
          isActive={activeTab === "Marketing Campaign"}
          onClick={() => setActiveTab("Marketing Campaign")}
        >
          Marketing Campaign
        </TabButton>
        <TabButton
          isActive={activeTab === "Summary"}
          onClick={() => setActiveTab("Summary")}
        >
          Summary
        </TabButton>
      </div>
      <div className="tab-content">
        {activeTab === "Opportunity" ? (
          <CompanyModuleOpportunitySection
            GOs={GOs}
            TOs={TOs}
            isFetchingGO={isFetchingGO}
            isFetchingTO={isFetchingTO}
            isGeneratingTO={isGeneratingTO}
            handleGenerateTO={handleGenerateTO}
          />
        ) : (
          <div>Hello World</div>
        )}
      </div>
    </div>
  );
};

export default CompanyModuleSection;
