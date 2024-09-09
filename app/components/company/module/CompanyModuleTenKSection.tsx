import React from "react";
import { TenKProps } from "../../interface";

interface CompanyModuleTenKSectionProps {
  data: TenKProps;
}

const CompanyModuleTenKSection: React.FC<CompanyModuleTenKSectionProps> = ({
  data,
}) => {
  return (
    <div className="p-4 bg-white max-h-[35rem] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">10-K Report</h2>
      <div className="mb-2">
        <strong>URL:</strong>{" "}
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          {data.url}
        </a>
      </div>
      <div className="mb-2">
        <strong>Filing Date:</strong> {data.filling_date}
      </div>
      <div className="mb-2">
        <strong>Content:</strong> {data.content}
      </div>
      <div className="mb-2">
        <strong>Item 1:</strong> {data.item_1}
      </div>
      <div className="mb-2">
        <strong>Item 1A:</strong> {data.item_1a}
      </div>
    </div>
  );
};

export default CompanyModuleTenKSection;
