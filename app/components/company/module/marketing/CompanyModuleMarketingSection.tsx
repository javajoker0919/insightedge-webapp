import { useState } from "react";

import CompanyModuleMarketingTable from "./CompanyModuleMarketingTable";
import { LoadingSection, NoDataSection } from "@/app/components";
import { MarketingProps } from "@/app/components/interface";
import CompanyModuleSubTabs from "../CompanyModuleSubTabs";

interface CompanyModuleMarketingSectionProps {
  GMs: MarketingProps[] | null;
  TMs: MarketingProps[] | null;
  isFetchingGM: boolean;
  isFetchingTM: boolean;
  isGeneratingTM: boolean;
  handleGenerateTM: () => void;
}

const CompanyModuleMarketingSection: React.FC<
  CompanyModuleMarketingSectionProps
> = ({
  GMs,
  TMs,
  isFetchingGM,
  isFetchingTM,
  isGeneratingTM,
  handleGenerateTM,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");

  return (
    <div className="h-full w-full">
      <CompanyModuleSubTabs active={activeTab} setActive={setActiveTab} />

      <div className="overflow-x-auto overflow-y-auto max-h-[35rem]">
        {activeTab === "general" ? (
          <>
            {isFetchingGM ? (
              <LoadingSection />
            ) : GMs == null ? (
              <NoDataSection content="There are no general marketing campaigns" />
            ) : (
              <CompanyModuleMarketingTable marketings={GMs} />
            )}
          </>
        ) : activeTab === "tailored" ? (
          <>
            {isFetchingTM ? (
              <LoadingSection />
            ) : TMs == null ? (
              <div className="w-full h-72 flex items-center justify-center">
                <button
                  onClick={handleGenerateTM}
                  disabled={isGeneratingTM}
                  className="px-4 py-2 w-80 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out disabled:cursor-not-allowed"
                >
                  {isGeneratingTM ? (
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                  ) : (
                    "Generate Tailored Marketing Campaigns"
                  )}
                </button>
              </div>
            ) : (
              <CompanyModuleMarketingTable marketings={TMs} />
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CompanyModuleMarketingSection;
