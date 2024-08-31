"use client";
import { useState } from "react";

import LandingCompanySearchbar from "./LandingCompanySearchbar";
import LandingCompanySectionTable from "./LandingCompanySectionTable";

const LandingCompanySection: React.FC = () => {
  const [companyID, setCompanyID] = useState<number | null>(16491);

  return (
    <div className="flex flex-col items-center gap-2 p-8">
      <LandingCompanySearchbar setCompanyID={setCompanyID} />
      <div className="w-full overflow-x-auto">
        <LandingCompanySectionTable companyID={companyID} />
      </div>
    </div>
  );
};

export default LandingCompanySection;
