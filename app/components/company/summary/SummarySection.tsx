import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { generateTailoredSummaryAPI } from "@/utils/apiClient";
import { profileAtom, orgInfoAtom, userInfoAtom } from "@/utils/atoms";
import RenderSummaryContent from "./RenderSummaryContent";
import { useToastContext } from "@/contexts/toastContext";
import { Details, Loading } from "../..";
import { getMixPanelClient } from "@/utils/mixpanel";

interface SummarySectionProps {
  year: number | null;
  quarter: number | null;
  etID: number | null;
  setJsonGS: React.Dispatch<React.SetStateAction<any | null>>;
  setJsonTS: React.Dispatch<React.SetStateAction<any | null>>;
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
  setJsonGS,
  setJsonTS,
}) => {
  if (!year || !quarter) {
    return null;
  }

  const { id: companyId } = useParams<{ id: string }>();
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const setProfile = useSetAtom(profileAtom);
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
  const [showMore, setShowMore] = useState<boolean>(false);

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
        setJsonGS(processedData);
        setShowFullSummary(true);
      } else {
        setGeneralSummary(null);
        setJsonGS([]);
        setShowFullSummary(false);
      }
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setGeneralSummary(null);
      setJsonGS(null);
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
        setJsonTS(processedData);
      } else {
        setTailoredSummary(null);
        setJsonTS([]);
      }
      setShowFullSummary(true);
    } catch (error) {
      console.error("Error fetching transcript data:", error);
      setTailoredSummary(null);
      setJsonTS(null);
    } finally {
      setIsTSLoading(false);
    }
  };

  const generateTailoredSummary = async () => {
    if (!orgInfo) {
      return;
    }

    mixpanel.track("generate.summary", {
      $source: "company_page",
    });

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

        setProfile((prev) => {
          if (!prev || !prev.credits) return prev;

          return {
            ...prev,
            credits: prev.credits - 1,
          };
        });

        setUserInfo((prev) => {
          if (!prev || !prev.creditCount) return prev;
          return {
            ...prev,
            creditCount: prev.creditCount ? prev.creditCount - 1 : 0,
          };
        });
        invokeToast("success", data.message);
        setActiveTab("tailored");
      } else if (data.status === "error") {
        invokeToast("error", `${data.message}`);
      }
    } catch (error) {
      invokeToast("error", "Failed to generate tailored summary");
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
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex flex-wrap gap-3 mb-4">
                {generalSummary.keywords
                  .sort((a, b) => b.weight - a.weight)
                  .slice(0, showMore ? undefined : 5)
                  .map((keywordObj, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        index < 5
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {keywordObj.keyword}
                      <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs font-semibold">
                        {keywordObj.weight}
                      </span>
                    </span>
                  ))}
              </div>
              {generalSummary.keywords.length > 5 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  {showMore ? "Show less" : "Show more keywords"}
                </button>
              )}
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
