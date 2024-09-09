import React from "react";
import { ClinicalTrialProps } from "../../interface";

interface CompanyModuleClinicalTrialSectionProps {
  data: ClinicalTrialProps;
}

const CompanyModuleClinicalTrialSection: React.FC<
  CompanyModuleClinicalTrialSectionProps
> = ({ data }) => {
  return (
    <div className="p-4 bg-white max-h-[35rem] overflow-y-auto">
      <div className="mb-2 text-xl font-bold">{data.title}</div>
      <div className="mb-2">
        <strong>NCT ID:</strong> {data.nct_id}
      </div>
      <div className="mb-2">
        <strong>Completion Date:</strong> {data.completion_date}
      </div>
      <div className="mb-2">
        <strong>Phase:</strong> {data.phase}
      </div>
      <div className="mb-2">
        <strong>Conditions:</strong> {data.conditions}
      </div>
      <div className="mb-2">
        <strong>Interventions:</strong> {data.interventions}
      </div>
      <div className="mb-2">
        <strong>Last Update Posted:</strong> {data.last_update_posted}
      </div>
    </div>
  );
};

export default CompanyModuleClinicalTrialSection;
