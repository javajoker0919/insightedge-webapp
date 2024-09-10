import React from "react";
import { TenKProps } from "../../interface";
import NoDataSection from "../../NoDataSection";
import { FaExternalLinkAlt } from "react-icons/fa"; // Importing the external link icon from react-icons

interface CompanyModuleTenKSectionProps {
  data: TenKProps;
}

const CompanyModuleTenKSection: React.FC<CompanyModuleTenKSectionProps> = ({
  data,
}) => {
  return (
    <div className="bg-white max-h-[35rem] overflow-y-auto">
      <div className="w-full pb-0 flex items-center justify-end">
        <button
          onClick={() => window.open(data.url, "_blank")}
          className="px-2 py-1 m-2 text-sm sm:w-auto text-gray-900 bg-white border rounded-full border-gray-300 flex items-center hover:bg-gray-100"
        >
          Open Full Report
          <FaExternalLinkAlt className="ml-2 h-3 w-3" />
        </button>
      </div>
      <NoDataSection content="There is no summary yet" />
    </div>
  );
};

export default CompanyModuleTenKSection;
