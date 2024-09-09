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
      <div className="mb-2 text-xl font-bold">
        {data.title} - {formattedDate}
      </div>

      <div className="mb-2">{data.text}</div>
    </div>
  );
};

export default CompanyModulePressReleaseSection;
