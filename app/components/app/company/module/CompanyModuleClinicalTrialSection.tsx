import React from "react";
import { ClinicalTrialProps } from "@/app/components/interface";

interface CompanyModuleClinicalTrialSectionProps {
  data: ClinicalTrialProps[];
}

const CompanyModuleClinicalTrialSection: React.FC<
  CompanyModuleClinicalTrialSectionProps
> = ({ data }) => {
  return (
    <div className="bg-white max-h-[35rem] overflow-y-auto">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="text-sm border bg-gray-100">
            <th className="py-2 px-2 border">Title</th>
            <th className="py-2 px-2 border">NCT ID</th>
            <th className="py-2 px-2 border">Completion Date</th>
            <th className="py-2 px-2 border w-20">Phase</th>
            <th className="py-2 px-2 border">Conditions</th>
            <th className="py-2 px-2 border">Interventions</th>
            <th className="py-2 px-2 border w-28">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {data.map((trial, index) => (
            <tr key={index} className="text-sm border">
              <td className="py-2 px-2 border">{trial.title}</td>
              <td className="py-2 px-2 border">{trial.nct_id}</td>
              <td className="py-2 px-2 border text-center">
                {trial.completion_date}
              </td>
              <td className="py-2 px-2 border text-center">{trial.phase}</td>
              <td className="py-2 px-2 border">{trial.conditions}</td>
              <td className="py-2 px-2 border">{trial.interventions}</td>
              <td className="py-2 px-2 border text-center">
                {trial.last_update_posted}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyModuleClinicalTrialSection;
