import { useState } from "react";
import { LoadingSection, NoDataSection } from "@/app/components";
import { SummaryProps } from "@/app/components/interface";
import CompanyModuleSubTabs from "../CompanyModuleSubTabs";
import CompanyModuleSummaryContent from "./CompanyModuleSummaryContent";

interface CompanyModuleSummarySectionProps {
  GS: SummaryProps | null | undefined;
  TS: SummaryProps | null | undefined;
  isFetchingGS: boolean;
  isFetchingTS: boolean;
  isGeneratingTS: boolean;
  handleGenerateTS: () => void;
}

const CompanyModuleSummarySection: React.FC<
  CompanyModuleSummarySectionProps
> = ({
  GS,
  TS,
  isFetchingGS,
  isFetchingTS,
  isGeneratingTS,
  handleGenerateTS,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");

  return (
    <div className="h-full w-full">
      <CompanyModuleSubTabs active={activeTab} setActive={setActiveTab} />

      <div className="overflow-x-auto overflow-y-auto max-h-[35rem]">
        {activeTab === "general" ? (
          <>
            {isFetchingGS ? (
              <LoadingSection />
            ) : GS === undefined || GS === null ? (
              <NoDataSection content="There is no general summary" />
            ) : (
              <CompanyModuleSummaryContent summary={GS} />
            )}
          </>
        ) : activeTab === "tailored" ? (
          <>
            {isFetchingTS ? (
              <LoadingSection />
            ) : TS === undefined || TS === null ? (
              <div className="w-full h-72 flex items-center justify-center">
                <button
                  onClick={handleGenerateTS}
                  disabled={isGeneratingTS}
                  className="px-4 py-2 w-72 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out disabled:cursor-not-allowed"
                >
                  {isGeneratingTS ? (
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                  ) : (
                    "Generate Tailored Summary"
                  )}
                </button>
              </div>
            ) : (
              <CompanyModuleSummaryContent summary={TS} />
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CompanyModuleSummarySection;
