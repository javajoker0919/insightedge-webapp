import React from "react";
import { PressReleaseProps } from "../../interface";

interface CompanyModulePressReleaseSectionProps {
  data: PressReleaseProps;
}

const CompanyModulePressReleaseSection: React.FC<
  CompanyModulePressReleaseSectionProps
> = ({ data }) => {
  const formattedDate = new Date(data.date).toLocaleDateString();

  return (
    <div className="p-4 bg-white max-h-[35rem] overflow-y-auto">
      <div className="mb-2">
        <strong>Date:</strong> {formattedDate}
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
