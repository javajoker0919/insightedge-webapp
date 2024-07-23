import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { generateTailoredSummaryAPI } from "@/utils/apiClient";
import { orgInfoAtom } from "@/utils/atoms";
import { Details } from "./components";

interface SummarySectionProps {
  selectedYear: number | null;
  selectedQuarter: number | null;
}

interface SummaryProps {
  summary: string;
  challenges: string;
  pain_points: string;
  opportunities: string;
  priorities: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  selectedYear,
  selectedQuarter,
}) => {
  const { id: companyId } = useParams<{ id: string }>();

  const orgInfo = useAtomValue(orgInfoAtom);
  const [generalSummary, setGeneralSummary] = useState<SummaryProps | null>(
    null
  );
  const [tailoredSummary, setTailoredSummary] = useState<SummaryProps | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"general" | "tailored">("general");
  const [isGSLoading, setIsGSLoading] = useState(false);
  const [isTSLoading, setIsTSLoading] = useState(false);
  const [isTSGenerating, setIsTSGenerating] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  useEffect(() => {
    setActiveTab("general");
    fetchGeneralSummary();
    fetchTailoredlSummary();
    setTailoredSummary(null);
  }, [companyId, selectedYear, selectedQuarter]);

  const fetchGeneralSummary = async () => {
    if (!selectedYear || !selectedQuarter) {
      return;
    }

    setIsGSLoading(true);
    try {
      const { data, error } = await supabase
        .from("earnings_transcripts")
        .select("summary, challenges, pain_points, opportunities, priorities")
        .eq("company_id", companyId)
        .eq("year", selectedYear)
        .eq("quarter", selectedQuarter)
        .single();

      if (error) throw error;
      setGeneralSummary(data as SummaryProps);
      setShowFullSummary(false);
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setGeneralSummary(null);
    } finally {
      setIsGSLoading(false);
    }
  };

  const fetchTailoredlSummary = async () => {
    if (!selectedYear || !selectedQuarter || !orgInfo) {
      return;
    }

    setIsTSLoading(true);
    try {
      const { data: etData, error: etError } = await supabase
        .from("earnings_transcripts")
        .select("id")
        .eq("company_id", companyId)
        .eq("year", selectedYear)
        .eq("quarter", selectedQuarter)
        .limit(1);

      if (etError) throw etError;
      const earningsTranscriptId = etData[0].id;

      const { data: tsData, error: tsError } = await supabase
        .from("tailored_summaries")
        .select("summary, challenges, pain_points, opportunities, priorities")
        .eq("organization_id", orgInfo?.id)
        .eq("earnings_transcript_id", earningsTranscriptId);

      if (tsError) throw tsError;
      setTailoredSummary(tsData[0] as SummaryProps);
      setShowFullSummary(false);
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setTailoredSummary(null);
    } finally {
      setIsTSLoading(false);
    }
  };

  const generateTailoredSummary = async () => {
    if (!orgInfo || !selectedYear || !selectedQuarter) {
      return;
    }

    setIsTSGenerating(true);
    try {
      const { data } = await generateTailoredSummaryAPI({
        companyID: companyId,
        orgID: orgInfo?.id.toString(),
        year: selectedYear,
        quarter: selectedQuarter,
      });

      setTailoredSummary(data.summary as SummaryProps);
      setActiveTab("tailored");
    } catch (error) {
      console.error("Error fetching tailored summary:", error);
      setTailoredSummary(null);
    } finally {
      setIsTSGenerating(false);
    }
  };

  const renderSummaryContent = (data: SummaryProps | null) => (
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
      <Details key={"Priorities"} title={"Priorities"} type="sub">
        <div className="px-3 py-2 text-gray-700 text-sm">
          {data?.["priorities"] || "No data"}
        </div>
      </Details>
      <Details key={"Challenges"} title={"Challenges"} type="sub">
        <div className="px-3 py-2 text-gray-700 text-sm">
          {data?.["challenges"] || "No data"}
        </div>
      </Details>
      <Details key={"Pain Points"} title={"Pain Points"} type="sub">
        <div className="px-3 py-2 text-gray-700 text-sm">
          {data?.["pain_points"] || "No data"}
        </div>
      </Details>
      <Details key={"Opportunities"} title={"Opportunities"} type="sub">
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
          tailoredSummary ? "" : "p-2"
        }`}
      >
        {tailoredSummary ? (
          <div className="flex">
            <button
              className={`px-4 py-4 border-b-2 ${
                activeTab === "general"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("general")}
            >
              General Summary
            </button>
            <button
              className={`px-4 py-4 border-b-2 ${
                activeTab === "tailored"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("tailored")}
            >
              Tailored Summary
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <p className="text-gray-700 p-2">Summary</p>
            {orgInfo && selectedYear && selectedQuarter && !isTSLoading && (
              <button
                // onClick={generateTailoredSummary}
                className="ml-2 px-3 w-60 flex items-center justify-center py-2 bg-indigo-600 text-white rounded-md text-sm"
              >
                {isTSGenerating ? (
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
        {(activeTab === "general" && isGSLoading) ||
        (activeTab === "tailored" && isTSLoading) ? (
          <div className="flex justify-center items-center h-40">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          </div>
        ) : activeTab === "general" ? (
          renderSummaryContent(generalSummary)
        ) : activeTab === "tailored" ? (
          renderSummaryContent(tailoredSummary)
        ) : null}
      </div>
    </div>
  );
};

export default SummarySection;
