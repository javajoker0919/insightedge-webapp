import { useState } from "react";

import CompanyModuleOpportunityTable from "./CompanyModuleOpportunityTable";
import { LoadingSection, NoDataSection } from "@/app/components";
import { OpportunityProps } from "@/app/components/interface";
import CompanyModuleSubTabs from "../CompanyModuleSubTabs";

interface CompanyModuleOpportunitySectionProps {
  GOs: OpportunityProps[] | null;
  TOs: OpportunityProps[] | null;
  isFetchingGO: boolean;
  isFetchingTO: boolean;
  isGeneratingTO: boolean;
  handleGenerateTO: () => void;
}

const CompanyModuleOpportunitySection: React.FC<
  CompanyModuleOpportunitySectionProps
> = ({
  GOs,
  TOs,
  isFetchingGO,
  isFetchingTO,
  isGeneratingTO,
  handleGenerateTO,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");

  return (
    <div className="h-full w-full">
      <CompanyModuleSubTabs active={activeTab} setActive={setActiveTab} />

      <div className="overflow-x-auto overflow-y-auto max-h-[35rem]">
        {activeTab == "general" ? (
          <>
            {isFetchingGO ? (
              <LoadingSection />
            ) : GOs === null || GOs.length === 0 ? (
              <NoDataSection content="There is no general opportunities" />
            ) : (
              <CompanyModuleOpportunityTable opportunities={GOs} />
            )}
          </>
        ) : activeTab == "tailored" ? (
          <>
            {isFetchingTO ? (
              <LoadingSection />
            ) : TOs === null || TOs.length === 0 ? (
              <div className="w-full h-72 flex items-center justify-center">
                <button
                  onClick={handleGenerateTO}
                  disabled={isGeneratingTO}
                  className="px-4 py-2 w-72 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out disabled:cursor-not-allowed"
                >
                  {isGeneratingTO ? (
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                  ) : (
                    "Generate Tailored Opportunities"
                  )}
                </button>
              </div>
            ) : (
              <CompanyModuleOpportunityTable opportunities={TOs} />
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CompanyModuleOpportunitySection;
