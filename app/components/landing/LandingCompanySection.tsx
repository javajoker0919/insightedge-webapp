"use client";
import { useState } from "react";

import LandingCompanySearchbar from "./LandingCompanySearchbar";
import LandingCompanySectionTable from "./LandingCompanySectionTable";

const LandingCompanySection: React.FC = () => {
  const [companyID, setCompanyID] = useState<number | null>(16491);
  const [isCompanySelected, setIsCompanySelected] = useState<boolean>(false);

  const handleCompanySelection = (id: number) => {
    setCompanyID(id);
    setIsCompanySelected(true);
  };

  return (
    <div className="relative flex flex-col items-center gap-2 p-8">
      <LandingCompanySearchbar
        setCompanyID={handleCompanySelection}
        isCompanySelected={isCompanySelected}
      />
      <LandingCompanySectionTable companyID={companyID} />
    </div>
  );
};

export default LandingCompanySection;
