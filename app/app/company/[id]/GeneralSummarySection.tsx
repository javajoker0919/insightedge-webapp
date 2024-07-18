import SummaryItem from "./components/SummaryItem";
import { TranscriptData } from "./page";

interface GeneralSummarySectionProps {
  transcriptData: TranscriptData | null;
  isLoading: boolean;
}

const GeneralSummarySection: React.FC<GeneralSummarySectionProps> = ({
  transcriptData,
  isLoading,
}) => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      General Summary
    </summary>
    <div className="px-4 py-3">
      {isLoading ? (
        <div className="flex justify-center items-center pb-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : (
        <>
          <SummaryItem
            key={"Summary"}
            title={"Summary"}
            content={transcriptData?.["summary"] || "No data"}
          />
          <SummaryItem
            key={"Priorities"}
            title={"Priorities"}
            content={transcriptData?.["priorities"] || "No data"}
          />
          <SummaryItem
            key={"Challenges"}
            title={"Challenges"}
            content={transcriptData?.["challenges"] || "No data"}
          />
          <SummaryItem
            key={"Pain Points"}
            title={"Pain Points"}
            content={transcriptData?.["pain_points"] || "No data"}
          />
          <SummaryItem
            key={"Opportunities"}
            title={"Opportunities"}
            content={transcriptData?.["opportunities"] || "No data"}
          />
        </>
      )}
    </div>
  </details>
);

export default GeneralSummarySection;
