import { useEffect, useState } from "react";
import { useToastContext } from "@/contexts/toastContext";
import { supabase } from "@/utils/supabaseClient";
import { profileAtom, creditCountAtom } from "@/utils/atoms";
import CompanyModuleOpportunitySection from "./opportunity/CompanyModuleOpportunitySection";
import CompanyModuleMarketingSection from "./marketing/CompanyModuleMarketingSection";
import CompanyModuleSummarySection from "./summary/CompanyModuleSummarySection";
import {
  OpportunityProps,
  MarketingProps,
  SummaryProps,
} from "@/app/components/interface";
import { useAtom, useAtomValue } from "jotai";
import { getMixPanelClient } from "@/utils/mixpanel";
import {
  generateTOAPI,
  generateTMAPI,
  generateTSAPI,
} from "@/utils/apiClient";

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
      className={`py-4 px-8 ${
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

  // Opportunity States
  const [GOs, setGOs] = useState<OpportunityProps[] | null>(null);
  const [TOs, setTOs] = useState<OpportunityProps[] | null>(null);
  const [isFetchingGO, setIsFetchingGO] = useState<boolean>(false);
  const [isFetchingTO, setIsFetchingTO] = useState<boolean>(false);
  const [isGeneratingTO, setIsGeneratingTO] = useState<boolean>(false);

  // Marketing States
  const [GMs, setGMs] = useState<MarketingProps[] | null>(null);
  const [TMs, setTMs] = useState<MarketingProps[] | null>(null);
  const [isFetchingGM, setIsFetchingGM] = useState<boolean>(false);
  const [isFetchingTM, setIsFetchingTM] = useState<boolean>(false);
  const [isGeneratingTM, setIsGeneratingTM] = useState<boolean>(false);

  // Summary States
  const [GS, setGS] = useState<SummaryProps | null>(null);
  const [TS, setTS] = useState<SummaryProps | null>(null);
  const [isFetchingGS, setIsFetchingGS] = useState<boolean>(false);
  const [isFetchingTS, setIsFetchingTS] = useState<boolean>(false);
  const [isGeneratingTS, setIsGeneratingTS] = useState<boolean>(false);

  useEffect(() => {
    if (etID) {
      fetchGO(etID);
      fetchGM(etID);
      fetchGS(etID);
    }
  }, [etID]);

  useEffect(() => {
    if (profile && profile.org_id) {
      fetchTO(etID, profile.org_id);
      fetchTM(etID, profile.org_id);
      fetchTS(etID, profile.org_id);
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

  const fetchGM = async (etID: number) => {
    setIsFetchingGM(true);

    try {
      const { data, error } = await supabase
        .from("general_marketings")
        .select(
          `
          call_to_action,
          channel,
          key_performance_indicators,
          strategic_alignment,
          tactic,
          tactic_score,
          target_personas,
          value_proposition
          `
        )
        .eq("earnings_transcript_id", etID);

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch general marketing strategies: ${error.message}`
        );
      } else if (data && data.length > 0) {
        const formattedData: MarketingProps[] = data.map((item) => ({
          callToAction: item.call_to_action,
          channel: item.channel,
          keyPerformanceIndicators: item.key_performance_indicators
            ? JSON.parse(item.key_performance_indicators)
            : [],
          strategicAlignment: item.strategic_alignment,
          tactic: item.tactic,
          tacticScore: item.tactic_score,
          targetPersonas: item.target_personas.split("\n"),
          valueProposition: item.value_proposition,
        }));

        setGMs(formattedData);
      } else {
        setGMs(null);
      }
    } catch (error) {
      invokeToast(
        "error",
        `Failed to fetch general marketing strategies: ${error}`
      );
      console.error(`Failed to fetch general marketing strategies: ${error}`);
    } finally {
      setIsFetchingGM(false);
    }
  };

  const fetchTM = async (etID: number, orgID: number) => {
    setIsFetchingTM(true);

    try {
      const { data, error } = await supabase
        .from("tailored_marketings")
        .select(
          `
          call_to_action,
          channel,
          key_performance_indicators,
          strategic_alignment,
          tactic,
          tactic_score,
          target_personas,
          value_proposition
          `
        )
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID);

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch tailored marketing strategies: ${error.message}`
        );
      } else if (data && data.length > 0) {
        const formattedData: MarketingProps[] = data.map((item) => ({
          callToAction: item.call_to_action,
          channel: item.channel,
          keyPerformanceIndicators: item.key_performance_indicators.split("\n"),
          strategicAlignment: item.strategic_alignment,
          tactic: item.tactic,
          tacticScore: item.tactic_score,
          targetPersonas: item.target_personas.split("\n"),
          valueProposition: item.value_proposition,
        }));

        setTMs(formattedData);
      } else {
        setTMs(null);
      }
    } catch (error) {
      invokeToast(
        "error",
        `Failed to fetch tailored marketing strategies: ${error}`
      );
      console.error(`Failed to fetch tailored marketing strategies: ${error}`);
    } finally {
      setIsFetchingTM(false);
    }
  };

  const handleGenerateTM = () => {
    mixpanel.track("generate.marketing", {
      $source: "company_page",
    });

    generateTM(etID);
  };

  const generateTM = async (etID: number) => {
    setIsGeneratingTM(true);

    try {
      const { data } = await generateTMAPI([etID]);

      if (data && data.marketings && data.marketings.length > 0) {
        const formattedData: MarketingProps[] = data.marketings.map(
          (item: any) => ({
            callToAction: item.call_to_action,
            channel: item.channel,
            keyPerformanceIndicators:
              item.key_performance_indicators.split("\n"),
            strategicAlignment: item.strategic_alignment,
            tactic: item.tactic,
            tacticScore: item.tactic_score,
            targetPersonas: item.target_personas.split("\n"),
            valueProposition: item.value_proposition,
          })
        );

        setTMs(formattedData);
      } else {
        setTMs(null);
      }


      invokeToast("success", data.message);

      setCreditCount((prev) => (prev ? prev - 1 : null));
    } catch (error) {
      invokeToast(
        "error",
        `Failed to generate tailored marketing strategies: ${error}`
      );
      console.error(
        `Failed to generate tailored marketing strategies: ${error}`
      );
    } finally {
      setIsGeneratingTM(false);
    }
  };

  const fetchGS = async (etID: number) => {
    setIsFetchingGS(true);

    try {
      const { data, error } = await supabase
        .from("earnings_transcripts")
        .select(
          "summary, challenges, pain_points, opportunities, priorities, keywords"
        )
        .eq("id", etID)
        .maybeSingle();

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch general summary: ${error.message}`
        );
      } else if (data) {
        const processedData: SummaryProps = {
          summary: data.summary ? data.summary.split("\n") : [],
          challenges: data.challenges ? data.challenges.split("\n") : [],
          pain_points: data.pain_points ? data.pain_points.split("\n") : [],
          opportunities: data.opportunities
            ? data.opportunities.split("\n")
            : [],
          priorities: data.priorities ? data.priorities.split("\n") : [],
          keywords: data.keywords ? JSON.parse(data.keywords) : [],
        };

        setGS(processedData);
      } else {
        setGS(null);
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch general summary: ${error}`);
      console.error(`Failed to fetch general summary: ${error}`);
    } finally {
      setIsFetchingGS(false);
    }
  };

  const fetchTS = async (etID: number, orgID: number) => {
    setIsFetchingTS(true);

    try {
      const { data, error } = await supabase
        .from("tailored_summaries")
        .select("summary, challenges, pain_points, opportunities, priorities")
        .eq("earnings_transcript_id", etID)
        .eq("organization_id", orgID)
        .maybeSingle();

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch tailored summary: ${error.message}`
        );
      } else if (data) {
        const processedData: SummaryProps = {
          summary: data.summary.split("\n"),
          challenges: data.challenges.split("\n"),
          pain_points: data.pain_points.split("\n"),
          opportunities: data.opportunities.split("\n"),
          priorities: data.priorities.split("\n"),
          keywords: [], // Assuming tailored summaries do not have keywords
        };

        setTS(processedData);
      } else {
        setTS(null);
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch tailored summary: ${error}`);
      console.error(`Failed to fetch tailored summary: ${error}`);
    } finally {
      setIsFetchingTS(false);
    }
  };

  const handleGenerateTS = () => {
    mixpanel.track("generate.summary", {
      $source: "company_page",
    });

    generateTS(etID);
  };

  const generateTS = async (etID: number) => {
    if (!profile || !profile.org_id) {
      invokeToast("error", "Organization ID not found");
      return;
    }

    setIsGeneratingTS(true);

    try {
      const { data } = await generateTSAPI([etID]);

      if (data && data.summaries && data.summaries.length > 0) {
        const processedData: SummaryProps = {
          summary: data.summaries[0].summary.split("\n"),
          challenges: data.summaries[0].challenges.split("\n"),
          pain_points: data.summaries[0].pain_points.split("\n"),
          opportunities: data.summaries[0].opportunities.split("\n"),
          priorities: data.summaries[0].priorities.split("\n"),
          keywords: [], // Assuming generated tailored summaries do not have keywords
        };

        setTS(processedData);
      } else {
        setTS(null);
      }


      invokeToast("success", data.message);

      setCreditCount((prev) => (prev ? prev - 1 : null));
    } catch (error) {
      invokeToast("error", `Failed to generate tailored summary: ${error}`);
      console.error(`Failed to generate tailored summary: ${error}`);
    } finally {
      setIsGeneratingTS(false);
    }
  };

  return (
    <div className="w-full border rounded">
      <div className="tabs flex justify-start gap-2 border-b border-gray-200">
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
        ) : activeTab === "Marketing Campaign" ? (
          <CompanyModuleMarketingSection
            GMs={GMs}
            TMs={TMs}
            isFetchingGM={isFetchingGM}
            isFetchingTM={isFetchingTM}
            isGeneratingTM={isGeneratingTM}
            handleGenerateTM={handleGenerateTM}
          />
        ) : (
          <CompanyModuleSummarySection
            GS={GS}
            TS={TS}
            isFetchingGS={isFetchingGS}
            isFetchingTS={isFetchingTS}
            isGeneratingTS={isGeneratingTS}
            handleGenerateTS={handleGenerateTS}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyModuleSection;
