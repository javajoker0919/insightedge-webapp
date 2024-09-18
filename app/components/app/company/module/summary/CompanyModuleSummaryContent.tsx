import React from "react";
import { SummaryProps } from "@/app/components/interface";

interface CompanyModuleSummaryContentProps {
  summary: SummaryProps;
}

const CompanyModuleSummaryContent: React.FC<
  CompanyModuleSummaryContentProps
> = ({ summary }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Summary</h3>
      <ul className="list-disc pl-5 mb-4">
        {summary.summary.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Challenges</h3>
      <ul className="list-disc pl-5 mb-4">
        {summary.challenges.map((challenge, index) => (
          <li key={index}>{challenge}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Pain Points</h3>
      <ul className="list-disc pl-5 mb-4">
        {summary.pain_points.map((painPoint, index) => (
          <li key={index}>{painPoint}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Opportunities</h3>
      <ul className="list-disc pl-5 mb-4">
        {summary.opportunities.map((opportunity, index) => (
          <li key={index}>{opportunity}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-2">Priorities</h3>
      <ul className="list-disc pl-5 mb-4">
        {summary.priorities.map((priority, index) => (
          <li key={index}>{priority}</li>
        ))}
      </ul>

      {summary.keywords.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {summary.keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                {keyword.keyword} ({keyword.weight})
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyModuleSummaryContent;
