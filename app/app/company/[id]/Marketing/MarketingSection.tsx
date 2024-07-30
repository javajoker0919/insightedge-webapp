import { useState, useEffect } from "react";
import { marketingStrategy } from "../Constants";
import MarketingStrategyTable from "./MarketingStrategyTable";
import MarketingPlanModal from "./MarketingPlanModal";

interface MarketingCompProps {
  companyID: number;
  companyName: string;
  year?: number | null;
  quarter?: number | null;
}

export interface MarketingProps {
  marketingTactic: string;
  tacticScore: number;
  tacticType: string;
  relevantAudience: string;
  channels: string[];
  tacticalDetails: {
    description: string;
    keyMessages: string[];
    callToAction: string;
    expectedROI: string;
    implementationTimeframe: string;
    requiredResources: string[];
    successMetrics: string[];
  };
  alignmentWithCompanyGoals: string[];
}

const MarketingSection: React.FC<MarketingCompProps> = ({
  companyID,
  companyName,
}) => {
  const [activeTab, setActiveTab] = useState<"" | "general" | "tailored">("");
  const [selectedStrats, setSelectedStrats] = useState<MarketingProps | null>(
    null
  );
  const [generalStrats, setGeneralStrats] = useState<MarketingProps[] | null>(
    null
  );
  const [tailoredStrats, setTailoredStrats] = useState<MarketingProps[] | null>(
    null
  );

  const [isGeneralLoading, setIsGeneralLoading] = useState<boolean>(false);
  const [isTailoredLoading, setIsTailoredLoading] = useState<boolean>(false);

  const generateTailoredStrategy = () => {
    setGeneralStrats(marketingStrategy);
    setTailoredStrats(marketingStrategy);

    setActiveTab("tailored");

    setIsGeneralLoading(false);
    setIsTailoredLoading(false);
  };

  const handleQuickAction = (strt: MarketingProps) => {
    setSelectedStrats(strt);
  };

  return (
    <div className="bg-primary border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full border-b border-gray-300 flex items-center bg-gray-100 justify-between">
        {activeTab === "" ? (
          <div className="flex w-full justify-between items-center pr-4 py-1">
            <h3 className="px-4 py-3 font-medium text-gray-700">
              Marketing Strategy
            </h3>
            {!Array.isArray(tailoredStrats) && (
              <button
                onClick={generateTailoredStrategy}
                disabled={isTailoredLoading}
                className="px-4 py-2 w-72 flex items-center justify-center text-sm bg-primary-600 text-white rounded-md border border-primary-700 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
              >
                {isTailoredLoading ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                ) : (
                  "Generate Tailored Marketing Strategy"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-4 border-primary-600 border-b-2 ${
                activeTab === "general"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              General Marketing Strategy
            </button>
            <button
              onClick={() => setActiveTab("tailored")}
              className={`px-4 py-4 border-primary-600 border-b-2 ${
                activeTab === "tailored"
                  ? "text-primary-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              Tailored Marketing Strategy
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[500px] text-sm">
        {activeTab === "general" &&
          (isGeneralLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black">
                {companyName}'s top Marketing Strategy.
                {tailoredStrats?.length === 0 && (
                  <span>
                    To find the best ways to sell your solutions to{" "}
                    {companyName}, click "Generate Tailored Marketing Strategy."
                  </span>
                )}
              </div>
              {generalStrats && (
                <MarketingStrategyTable
                  companyName={companyName}
                  strategies={generalStrats.sort(() => Math.random() - 0.5)}
                  // SM_NOTE: remove this suffeling later
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
        {activeTab === "tailored" &&
          (isTailoredLoading ? (
            <LoadingSection />
          ) : (
            <>
              <div className="p-4 bg-gray-100 text-black">
                Below is your company specific marketing strategy. You can
                explore the top marketing tactics for selling your solutions to{" "}
                {companyName}
              </div>
              {tailoredStrats && (
                <MarketingStrategyTable
                  companyName={companyName}
                  strategies={tailoredStrats.sort(() => Math.random() - 0.5)}
                  // SM_NOTE: remove this suffeling later
                  onQuickAction={handleQuickAction}
                />
              )}
            </>
          ))}
      </div>
      <MarketingPlanModal
        open={!!selectedStrats}
        onClose={() => setSelectedStrats(null)}
      />
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

export default MarketingSection;
