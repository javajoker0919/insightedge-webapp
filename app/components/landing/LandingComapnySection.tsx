"use client";
import { useState } from "react";

import LandingCompanySearchbar from "./LandingCompanySearchbar";
import LandingCompanySectionTable from "./LandingCompanySectionTable";

const LandingCompanySection: React.FC = () => {
  const [companyID, setCompanyID] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-2 p-8">
      <LandingCompanySearchbar setCompanyID={setCompanyID} />
      <LandingCompanySectionTable companyID={companyID} />
    </div>
  );
};

export default LandingCompanySection;
