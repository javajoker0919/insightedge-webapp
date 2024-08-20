import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { generateTailoredSummaryAPI } from "@/utils/apiClient";
import { orgInfoAtom, userInfoAtom } from "@/utils/atoms";
import RenderSummaryContent from "./RenderSummaryContent";
import { useToastContext } from "@/contexts/toastContext";
import { Details, Loading } from "../..";

interface SummarySectionProps {
  year: number | null;
  quarter: number | null;
  etID: number | null;
}

export interface SummaryProps {
  summary: string[];
  challenges: string[];
  pain_points: string[];
  opportunities: string[];
  priorities: string[];
  keywords: { keyword: string; weight: number }[];
}

const SummarySection: React.FC<SummarySectionProps> = ({
  year,
  quarter,
  etID,
}) => {
  if (!year || !quarter) {
    return null;
  }

  const { id: companyId } = useParams<{ id: string }>();

  const { invokeToast } = useToastContext();
  const orgInfo = useAtomValue(orgInfoAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
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
  const [showFullSummary, setShowFullSummary] = useState(true);

  useEffect(() => {
    setActiveTab("general");
    fetchGeneralSummary();
    fetchTailoredlSummary();
    setTailoredSummary(null);
  }, [companyId, year, quarter]);

  const fetchGeneralSummary = async () => {
    setIsGSLoading(true);
    try {
      const { data, error } = await supabase
        .from("earnings_transcripts")
        .select(
          "summary, challenges, pain_points, opportunities, priorities, keywords"
        )
        .eq("company_id", companyId)
        .eq("year", year)
        .eq("quarter", quarter)
        .single();

      if (error) throw error;

      if (data) {
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

        setGeneralSummary(processedData);
        setShowFullSummary(true);
      } else {
        setGeneralSummary(null);
        setShowFullSummary(false);
      }
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setGeneralSummary(null);
    } finally {
      setIsGSLoading(false);
    }
  };

  const fetchTailoredlSummary = async () => {
    if (!orgInfo) {
      return;
    }

    setIsTSLoading(true);
    try {
      const { data: etData, error: etError } = await supabase
        .from("earnings_transcripts")
        .select("id")
        .eq("company_id", companyId)
        .eq("year", year)
        .eq("quarter", quarter)
        .limit(1);

      if (etError) throw etError;
      const earningsTranscriptId = etData[0].id;

      const { data: tsData, error: tsError } = await supabase
        .from("tailored_summaries")
        .select("summary, challenges, pain_points, opportunities, priorities")
        .eq("organization_id", orgInfo?.id)
        .eq("earnings_transcript_id", earningsTranscriptId);

      if (tsError) throw tsError;
      if (tsData.length > 0) {
        const processedData: SummaryProps = {
          summary: tsData[0].summary.split("\n"),
          challenges: tsData[0].challenges.split("\n"),
          pain_points: tsData[0].pain_points.split("\n"),
          opportunities: tsData[0].opportunities.split("\n"),
          priorities: tsData[0].priorities.split("\n"),
          keywords: [], // Assuming tailored summaries do not have keywords
        };

        setTailoredSummary(processedData);
      } else {
        setTailoredSummary(null);
      }
      setShowFullSummary(true);
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setTailoredSummary(null);
    } finally {
      setIsTSLoading(false);
    }
  };

  const generateTailoredSummary = async () => {
    if (!orgInfo) {
      return;
    }

    setIsTSGenerating(true);
    try {
      const { data } = await generateTailoredSummaryAPI({
        companyID: companyId,
        orgID: orgInfo?.id.toString(),
        year: year,
        quarter: quarter,
      });

      if (data.status === "success") {
        const processedData: SummaryProps = {
          summary: data.summary.summary.split("\n"),
          challenges: data.summary.challenges.split("\n"),
          pain_points: data.summary.pain_points.split("\n"),
          opportunities: data.summary.opportunities.split("\n"),
          priorities: data.summary.priorities.split("\n"),
          keywords: [], // Assuming generated tailored summaries do not have keywords
        };

        setTailoredSummary(processedData);
        setUserInfo((prev) => {
          if (!prev || !prev.creditCount) return prev;
          return {
            ...prev,
            creditCount: prev.creditCount ? prev.creditCount - 1 : 0,
          };
        });
        invokeToast("success", data.message, "top");
        setActiveTab("tailored");
      } else if (data.status === "error") {
        invokeToast("error", `${data.message}`, "top");
      }
    } catch (error) {
      invokeToast("error", "Failed to generate tailored summary", "top");
      console.error("Error fetching tailored summary:", error);
      setTailoredSummary(null);
    } finally {
      setIsTSGenerating(false);
    }
  };

  return (
    <div>
      {(activeTab === "general" && isGSLoading) ||
      (activeTab === "tailored" && isTSLoading) ? (
        <div className="flex justify-center items-center h-40">
          <Loading />
        </div>
      ) : (
        generalSummary &&
        generalSummary.keywords.length > 0 && (
          <Details title="Keywords">
            <div className="p-2 flex flex-wrap overflow-y-auto max-h-80 gap-2">
              {generalSummary.keywords
                .sort((a, b) => b.weight - a.weight)
                .map((keywordObj, index) => (
                  <span
                    key={index}
                    className={`flex items-center divide-x rounded divide-gray-300 border bg-gray-100 overflow-hidden border-gray-300 text-gray-600 ${
                      index < 5 ? "bg-yellow-200 text-yellow-800" : ""
                    }`}
                  >
                    <span className={`px-2 py-0.5`}>{keywordObj.keyword}</span>
                    <span className={`px-2 py-0.5`}>{keywordObj.weight}</span>
                  </span>
                ))}
            </div>
          </Details>
        )
      )}

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
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("general")}
              >
                General Summary
              </button>
              <button
                className={`px-4 py-4 border-b-2 ${
                  activeTab === "tailored"
                    ? "border-primary-600 text-primary-600"
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
              {orgInfo && !isTSLoading && (
                <button
                  title="Get custom earnings report summaries tailored to your business needs"
                  disabled={isTSGenerating}
                  onClick={generateTailoredSummary}
                  className="ml-2 px-3 w-60 flex items-center justify-center py-2 bg-primary-600 text-white rounded-md text-sm"
                >
                  {isTSGenerating ? (
                    <span className="ml-2 inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  ) : (
                    <span>Generate Tailored Summary</span>
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
              <Loading />
            </div>
          ) : activeTab === "general" ? (
            <RenderSummaryContent
              data={generalSummary}
              showFullSummary={showFullSummary}
              setShowFullSummary={setShowFullSummary}
            />
          ) : activeTab === "tailored" ? (
            <RenderSummaryContent
              data={tailoredSummary}
              showFullSummary={showFullSummary}
              setShowFullSummary={setShowFullSummary}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
