import React, { useState } from "react";
import { TenKProps } from "../../interface";
import NoDataSection from "../../NoDataSection";

interface CompanyModuleTenKSectionProps {
  data: TenKProps;
}

const CompanyModuleTenKSection: React.FC<CompanyModuleTenKSectionProps> = ({
  data,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "iframe">("summary");

  return (
    <div className="bg-white max-h-[35rem] overflow-y-auto">
      <div className="w-full border-b pb-0 flex items-center justify-between">
        <div className="flex border border-b-0">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-16 py-2 w-full sm:w-auto ${
              activeTab === "summary"
                ? "text-gray-900 bg-white border-gray-300"
                : "text-gray-500 bg-gray-100 hover:bg-gray-100"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab("iframe")}
            className={`px-16 py-2 w-full sm:w-auto ${
              activeTab === "iframe"
                ? "text-gray-900 bg-white border-gray-300"
                : "text-gray-500 bg-gray-100 hover:bg-gray-100"
            }`}
          >
            Full Report
          </button>
        </div>
      </div>
      {activeTab === "summary" ? (
        <NoDataSection content="There is no summary yet" />
      ) : (
        <div className="">
          <iframe
            src={data.url}
            title="10-K Report"
            width="100%"
            height="500px"
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CompanyModuleTenKSection;
