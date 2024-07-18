import { useState } from "react";

import { TranscriptData } from "./page";
import { Details } from "./components";

interface SummarySectionProps {
  transcriptData: TranscriptData | null;
  isLoading: boolean;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  transcriptData,
  isLoading,
}) => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [showFullSummary, setShowFullSummary] = useState(false);

  const handleButtonClick = () => {
    setIsButtonLoading(true);
    setTimeout(() => {
      setIsButtonLoading(false);
      setShowTabs(true);
    }, 2000);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <summary
        className={`bg-gray-100 font-medium text-gray-700 flex items-center justify-between ${
          showTabs ? "" : "p-2"
        }`}
      >
        {showTabs ? (
          <div className="flex">
            <button
              className={`px-4 py-4 border-b-2 ${
                activeTab === "summary"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              General Summary
            </button>
            <button
              className={`px-4 py-4 border-b-2 ${
                activeTab === "details"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Tailored Summary
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="text-gray-700 px-2">Summary</p>
            {!showTabs && (
              <button
                onClick={handleButtonClick}
                className="ml-2 px-3 w-60 flex items-center justify-center py-2 bg-indigo-600 text-white rounded-md text-sm"
              >
                {isButtonLoading ? (
                  <span className="ml-2 inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                ) : (
                  <p>Generate Tailored Summary</p>
                )}
              </button>
            )}
          </div>
        )}
      </summary>
      <div className="px-3 py-1">
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <>
            {activeTab === "summary" && (
              <>
                {transcriptData?.["summary"] && (
                  <div className="px-1.5 py-3">
                    <p className="text-left w-full text-gray-700">
                      {showFullSummary
                        ? transcriptData.summary
                        : `${transcriptData.summary.slice(0, 100)}...`}
                      {!showFullSummary && (
                        <button
                          onClick={() => setShowFullSummary(true)}
                          className="text-blue-500 hover:underline ml-1"
                        >
                          more
                        </button>
                      )}
                    </p>
                  </div>
                )}
                <Details key={"Priorities"} title={"Priorities"}>
                  <div className="px-3 py-2 text-gray-700 text-sm">
                    {transcriptData?.["priorities"] || "No data"}
                  </div>
                </Details>
                <Details key={"Challenges"} title={"Challenges"}>
                  <div className="px-3 py-2 text-gray-700 text-sm">
                    {transcriptData?.["challenges"] || "No data"}
                  </div>
                </Details>
                <Details key={"Pain Points"} title={"Pain Points"}>
                  <div className="px-3 py-2 text-gray-700 text-sm">
                    {transcriptData?.["pain_points"] || "No data"}
                  </div>
                </Details>
                <Details key={"Opportunities"} title={"Opportunities"}>
                  <div className="px-3 py-2 text-gray-700 text-sm">
                    {transcriptData?.["opportunities"] || "No data"}
                  </div>
                </Details>
              </>
            )}
            {activeTab === "details" && (
              <div className="w-full flex justify-center py-10">
                Tailored Summary should be here
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SummarySection;
