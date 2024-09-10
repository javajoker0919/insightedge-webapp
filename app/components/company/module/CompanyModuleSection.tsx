import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { generateTOAPI, generateTMAPI, generateTSAPI } from "@/utils/apiClient";
import { profileAtom, creditCountAtom } from "@/utils/atoms";
import { getMixPanelClient } from "@/utils/mixpanel";
import { useToastContext } from "@/contexts/toastContext";
import { supabase } from "@/utils/supabaseClient";

import CompanyModuleOpportunitySection from "./opportunity/CompanyModuleOpportunitySection";
import CompanyModuleMarketingSection from "./marketing/CompanyModuleMarketingSection";
import CompanyModuleSummarySection from "./summary/CompanyModuleSummarySection";
import {
  OpportunityProps,
  MarketingProps,
  SummaryProps,
  ClinicalTrialProps,
  PressReleaseProps,
  TenKProps,
} from "@/app/components/interface";
import ModuleShareButtonGroup from "./share/ModuleShareButtonGroup";
import { CloseIcon, PlusIcon } from "../../icon";
import Modal from "../../Modal";
import CompanyModuleTenKSection from "./CompanyModuleTenKSection";
import CompanyModulePressReleaseSection from "./CompanyModulePressReleaseSection";
import CompanyModuleClinicalTrialSection from "./CompanyModuleClinicalTrialSection";
import CompanyModuleGovernmentContractSection from "./CompanyModuleGovernmentContractSection";

interface CompanyModuleSectionProps {
  companyID: number;
  companyName: string;
  etID: number | null;
}

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}

interface ModuleItem {
  value: string;
  title: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  title,
  isActive,
  onClick,
  onClose,
}) => {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`pb-1 w-60 flex-1 ${
        isActive ? "text-gray-800 bg-white rounded-t-lg" : "text-gray-500"
      }`}
    >
      <div
        className={`flex items-center justify-between pl-4 pr-2.5 py-2 rounded-lg ${
          isActive ? "" : "hover:bg-gray-100"
        }`}
      >
        <span className="line-clamp-1 text-left break-all">{title}</span>
        <button
          className={`ml-2 p-0.5 rounded-full ${
            isActive ? "hover:bg-gray-200" : "hover:bg-gray-200"
          } `}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <CloseIcon color="black" />
        </button>
      </div>
    </button>
  );
};

const CompanyModuleSection: React.FC<CompanyModuleSectionProps> = ({
  companyID,
  companyName,
  etID,
}) => {
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const profile = useAtomValue(profileAtom);
  const setCreditCount = useSetAtom(creditCountAtom);

  const [activeTab, setActiveTab] = useState("opportunity");

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
  const [GS, setGS] = useState<SummaryProps | null | undefined>(undefined);
  const [TS, setTS] = useState<SummaryProps | null | undefined>(undefined);
  const [isFetchingGS, setIsFetchingGS] = useState<boolean>(false);
  const [isFetchingTS, setIsFetchingTS] = useState<boolean>(false);
  const [isGeneratingTS, setIsGeneratingTS] = useState<boolean>(false);

  const initialModuleItems: ModuleItem[] = [
    {
      title: "Opportunity",
      value: "opportunity",
    },
    {
      title: "Marketing Campaign",
      value: "marketing_campaign",
    },
    {
      title: "Transcript Summary",
      value: "transcript_summary",
    },
  ];

  const [additionalModuleItems, setAdditionalModuleItems] = useState<
    ModuleItem[]
  >([]);
  const [userModuleItems, setUserModuleItems] =
    useState<ModuleItem[]>(initialModuleItems);
  const [showAddModulePopup, setShowAddModulePopup] = useState(false);

  const [tenKData, setTenKData] = useState<TenKProps | null>(null);
  const [pressReleaseData, setPressReleaseData] =
    useState<PressReleaseProps | null>(null);
  const [clinicalTrialData, setClinicalTrialData] = useState<
    ClinicalTrialProps[]
  >([]);

  useEffect(() => {
    fetchTenKData(companyID);
    fetchPressReleaseData(companyID);
    fetchClinicalTrialData(companyID);
  }, []);

  useEffect(() => {
    if (etID) {
      if (activeTab === "opportunity" && GOs === null) fetchGO(etID);
      if (activeTab === "marketing_campaign" && GMs === null) fetchGM(etID);
      if (activeTab === "transcript_summary" && GS === undefined) fetchGS(etID);
    }
  }, [etID, activeTab]);

  useEffect(() => {
    if (etID && profile && profile.org_id) {
      const orgID = profile.org_id;

      if (activeTab === "opportunity" && GOs === null) fetchTO(etID, orgID);
      if (activeTab === "marketing_campaign" && GMs === null)
        fetchTM(etID, orgID);
      if (activeTab === "transcript_summary" && GS === undefined)
        fetchTS(etID, orgID);
    }
  }, [etID, profile, activeTab]);

  const fetchTenKData = async (companyID: number) => {
    try {
      const { data, error } = await supabase
        .from("10K_info")
        .select(
          `
          url,
          filling_date,
          content,
          item_1,
          item_1a
          `
        )
        .eq("company_id", companyID)
        .maybeSingle();
      if (error) {
        console.error("Error fetching 10-K data:", error);
      } else {
        if (data) {
          setTenKData(data);

          setAdditionalModuleItems((prev) => {
            if (!prev.some((item) => item.value === "ten-k")) {
              return [...prev, { value: "ten-k", title: "10-K" }];
            }
            return prev;
          });
          setUserModuleItems((prev) => {
            if (!prev.some((item) => item.value === "ten-k")) {
              return [...prev, { value: "ten-k", title: "10-K" }];
            }
            return prev;
          });
        } else {
          setTenKData(null);
          setUserModuleItems((prev) =>
            prev.filter((item) => item.value !== "ten-k")
          );
        }
      }
    } catch (error) {
      console.error("Error fetching 10-K data:", error);
    }
  };

  const fetchPressReleaseData = async (companyID: number) => {
    try {
      const { data, error } = await supabase
        .from("press_releases")
        .select(
          `
          date, title, text
          `
        )
        .eq("company_id", companyID)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching press release data:", error);
      } else {
        if (data) {
          setPressReleaseData(data);

          setAdditionalModuleItems((prev) => {
            if (!prev.some((item) => item.value === "press_release")) {
              return [
                ...prev,
                { value: "press_release", title: "Press Release" },
              ];
            }
            return prev;
          });
          setUserModuleItems((prev) => {
            if (!prev.some((item) => item.value === "press_release")) {
              return [
                ...prev,
                { value: "press_release", title: "Press Release" },
              ];
            }
            return prev;
          });
        } else {
          setPressReleaseData(null);
          setUserModuleItems((prev) =>
            prev.filter((item) => item.value !== "press_release")
          );
        }
      }
    } catch (error) {
      console.error("Error fetching press release data:", error);
    }
  };

  const fetchClinicalTrialData = async (companyID: number) => {
    try {
      const { data, error } = await supabase
        .from("clinical_trials")
        .select(
          `
          company_name,
          company_symbol,
          nct_id,
          completion_date,
          phase,
          title,
          conditions,
          interventions,
          last_update_posted
          `
        )
        .eq("company_id", companyID)
        .order("last_update_posted", { ascending: false });

      if (error) {
        console.error("Error fetching clinical trial data:", error);
      } else {
        if (data && data.length > 0) {
          setClinicalTrialData(data);

          setAdditionalModuleItems((prev) => {
            if (!prev.some((item) => item.value === "clinical_trial")) {
              return [
                ...prev,
                { value: "clinical_trial", title: "Clinical Trial" },
              ];
            }
            return prev;
          });
          setUserModuleItems((prev) => {
            if (!prev.some((item) => item.value === "clinical_trial")) {
              return [
                ...prev,
                { value: "clinical_trial", title: "Clinical Trial" },
              ];
            }
            return prev;
          });
        } else {
          setClinicalTrialData([]);
          setUserModuleItems((prev) =>
            prev.filter((item) => item.value !== "clinical_trial")
          );
        }
      }
    } catch (error) {
      console.error("Error fetching clinical trial data:", error);
    }
  };

  const handleAddModule = async (item: ModuleItem) => {
    if (!profile || !profile.user_id) {
      return;
    }

    const previousItems = [...userModuleItems];
    const updatedItems = [...previousItems, item];
    setUserModuleItems(updatedItems);
  };

  const handleRemoveModule = async (item: ModuleItem) => {
    if (!profile?.user_id) return;

    const previousItems = [...userModuleItems];
    const updatedItems = previousItems.filter((i) => i.value !== item.value);
    setUserModuleItems(updatedItems);

    setActiveTab((prev) =>
      prev === item.value ? userModuleItems[0].value : prev
    );
  };

  if (etID == null) {
    return null;
  }

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
        setGOs([]);
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
        setTOs([]);
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
        setTOs([]);
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
        setGMs([]);
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
        setTMs([]);
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
        setTMs([]);
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
        .not("summary", "is", null)
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
      <div className="tabs flex items-center gap-2 justify-between bg-gray-200">
        <div className="flex items-center w-full">
          <div className="flex items-center gap-0.5 px-1 pt-1 pb-0">
            {userModuleItems.map((item: ModuleItem, index) => (
              <>
                <TabButton
                  key={item.value}
                  title={item.title}
                  isActive={activeTab === item.value}
                  onClick={() => setActiveTab(item.value)}
                  onClose={() => handleRemoveModule(item)}
                />

                {index ===
                  userModuleItems.map((item) => item.value).indexOf(activeTab) -
                    1 ||
                index ===
                  userModuleItems
                    .map((item) => item.value)
                    .indexOf(activeTab) ? (
                  <div className="h-6 w-px border -translate-y-0.5" />
                ) : (
                  <div className="h-6 w-px border border-white -translate-y-0.5" />
                )}
              </>
            ))}
          </div>
          <button
            className="p-2 rounded-full text-gray-500 hover:bg-gray-50"
            onClick={() => setShowAddModulePopup(true)}
          >
            <PlusIcon color="black" />
          </button>
          <div className="flex-grow"></div>
        </div>

        <div className="pr-1">
          <ModuleShareButtonGroup
            companyID={companyID}
            etIDs={[etID]}
            items={additionalModuleItems}
          />
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "opportunity" && (
          <CompanyModuleOpportunitySection
            GOs={GOs}
            TOs={TOs}
            isFetchingGO={isFetchingGO}
            isFetchingTO={isFetchingTO}
            isGeneratingTO={isGeneratingTO}
            handleGenerateTO={handleGenerateTO}
          />
        )}
        {activeTab === "marketing_campaign" && (
          <CompanyModuleMarketingSection
            GMs={GMs}
            TMs={TMs}
            isFetchingGM={isFetchingGM}
            isFetchingTM={isFetchingTM}
            isGeneratingTM={isGeneratingTM}
            handleGenerateTM={handleGenerateTM}
          />
        )}
        {activeTab === "transcript_summary" && (
          <CompanyModuleSummarySection
            GS={GS}
            TS={TS}
            isFetchingGS={isFetchingGS}
            isFetchingTS={isFetchingTS}
            isGeneratingTS={isGeneratingTS}
            handleGenerateTS={handleGenerateTS}
          />
        )}
        {activeTab === "ten-k" && tenKData && (
          <CompanyModuleTenKSection data={tenKData} />
        )}
        {activeTab === "press_release" && pressReleaseData && (
          <CompanyModulePressReleaseSection data={pressReleaseData} />
        )}
        {activeTab === "clinical_trial" && clinicalTrialData && (
          <CompanyModuleClinicalTrialSection data={clinicalTrialData} />
        )}
        {activeTab === "government_contract" && false && (
          <CompanyModuleGovernmentContractSection />
        )}
      </div>
      {showAddModulePopup && (
        <AddModulePopup
          isOpen={showAddModulePopup}
          availableModules={[
            ...initialModuleItems,
            ...additionalModuleItems,
          ].filter(
            (item) =>
              !userModuleItems.some((userItem) => userItem.value === item.value)
          )}
          onAdd={handleAddModule}
          onClose={() => setShowAddModulePopup(false)}
        />
      )}
    </div>
  );
};

interface AddModulePopupProps {
  isOpen: boolean;
  availableModules: ModuleItem[];
  onAdd: (item: ModuleItem) => void;
  onClose: () => void;
}

const AddModulePopup: React.FC<AddModulePopupProps> = ({
  isOpen,
  availableModules,
  onAdd,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-4 rounded">
        <h2 className="text-lg font-bold mb-4 text-center">Add Item</h2>
        {availableModules.length > 0 ? (
          <ul>
            {availableModules.map((module) => (
              <li key={module.value} className="mb-2">
                <button
                  onClick={() => onAdd(module)}
                  className={
                    "p-4 text-base w-full font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                  }
                >
                  {module.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">There is no item to add</p>
        )}
      </div>
    </Modal>
  );
};

export default CompanyModuleSection;
