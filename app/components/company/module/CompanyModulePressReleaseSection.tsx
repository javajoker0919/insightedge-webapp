import React from "react";
import { PressReleaseProps } from "../../interface";

interface CompanyModulePressReleaseSectionProps {
  data: PressReleaseProps;
}

const CompanyModulePressReleaseSection: React.FC<
  CompanyModulePressReleaseSectionProps
> = ({ data }) => {
  return (
    <div className="p-4 bg-white max-h-[35rem] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Press Release</h2>
      <div className="mb-2">
        <strong>Date:</strong> {data.date}
      </div>
      <div className="mb-2">
        <strong>Title:</strong> {data.title}
      </div>
      <div className="mb-2">
        <strong>Text:</strong> {data.text}
      </div>
    </div>
  );
};

export default CompanyModulePressReleaseSection;
