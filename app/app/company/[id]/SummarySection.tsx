import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

import { TranscriptData } from "./page";
import { Details } from "./components";

interface SummarySectionProps {
  selectedYear: number | null;
  selectedQuarter: number | null;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  selectedYear,
  selectedQuarter,
}) => {
  const { id: companyId } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [generalSummary, setGeneralSummary] = useState<TranscriptData | null>(
    null
  );
  const [tailoredSummary, setTailoredSummary] = useState<TranscriptData | null>(
    null
  );
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("general summary");
  const [showFullSummary, setShowFullSummary] = useState(false);

  useEffect(() => {
    const fetchTranscriptData = async () => {
      if (selectedYear && selectedQuarter) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("earnings_transcripts")
            .select(
              "summary, challenges, pain_points, opportunities, priorities"
            )
            .eq("company_id", companyId)
            .eq("year", selectedYear)
            .eq("quarter", selectedQuarter)
            .single();

          if (error) throw error;
          setGeneralSummary(data as TranscriptData);
        } catch (error) {
          console.error("Error fetching transcript data:", error);
          setGeneralSummary(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTranscriptData();
  }, [companyId, selectedYear, selectedQuarter]);

  const handleButtonClick = () => {
    setIsButtonLoading(true);
    setTimeout(() => {
      setIsButtonLoading(false);
      setShowTabs(true);
      setActiveTab("tailored summary");
      // Here you would typically fetch or generate the tailored summary
      // For now, we'll just use the same data as the general summary
      setTailoredSummary(generalSummary);
    }, 2000);
  };

  const renderSummaryContent = (data: TranscriptData | null) => (
    <>
      {data?.["summary"] && (
        <div className="px-1.5 py-3">
          <p className="text-left w-full text-gray-700">
            {showFullSummary
              ? data.summary
              : `${data.summary.slice(0, 100)}...`}
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
          {data?.["priorities"] || "No data"}
        </div>
      </Details>
      <Details key={"Challenges"} title={"Challenges"}>
        <div className="px-3 py-2 text-gray-700 text-sm">
          {data?.["challenges"] || "No data"}
        </div>
      </Details>
      <Details key={"Pain Points"} title={"Pain Points"}>
        <div className="px-3 py-2 text-gray-700 text-sm">
          {data?.["pain_points"] || "No data"}
        </div>
      </Details>
      <Details key={"Opportunities"} title={"Opportunities"}>
        <div className="px-3 py-2 text-gray-700 text-sm">
          {data?.["opportunities"] || "No data"}
        </div>
      </Details>
    </>
  );

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
                activeTab === "general summary"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("general summary")}
            >
              General Summary
            </button>
            <button
              className={`px-4 py-4 border-b-2 ${
                activeTab === "tailored summary"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("tailored summary")}
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
            {activeTab === "general summary" &&
              renderSummaryContent(generalSummary)}
            {activeTab === "tailored summary" &&
              renderSummaryContent(tailoredSummary)}
          </>
        )}
      </div>
    </div>
  );
};

export default SummarySection;
