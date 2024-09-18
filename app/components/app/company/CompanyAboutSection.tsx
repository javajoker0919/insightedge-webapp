import { useEffect, useState } from "react";
import { FaUserTie, FaBuilding, FaGlobe, FaUsers } from "react-icons/fa";

import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import { Details, LoadingSection, NoDataSection } from "../../";

interface CompanyAboutSectionProps {
  companyID: number;
}

interface CompanyDataProps {
  description: string;
  ceo: string;
  address: string;
  city: string;
  website: string;
  full_time_employees: string;
}

const CompanyAboutSection: React.FC<CompanyAboutSectionProps> = ({
  companyID,
}) => {
  const { invokeToast } = useToastContext();

  const [companyData, setCompanyData] = useState<CompanyDataProps | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    fetchCompanyData(companyID);
  }, [companyID]);

  const fetchCompanyData = async (companyID: number) => {
    setIsFetching(true);

    try {
      const { data, error } = await supabase
        .from("companies")
        .select(
          `
          description,
          ceo,
          address,
          city,
          website,
          full_time_employees
          `
        )
        .eq("id", companyID)
        .single();

      if (error) {
        invokeToast("error", `Failed to fetch company data: ${error.message}`);
      } else if (data) {
        setCompanyData(data as CompanyDataProps);
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch company data: ${error}`);
      console.error(`Failed to fetch company data: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Details title="About">
      {isFetching ? (
        <LoadingSection />
      ) : companyData == null ? (
        <NoDataSection />
      ) : (
        <div className="px-3 pt-1 pb-2 text-sm text-gray-700">
          <p className="pb-2">{companyData.description}</p>
          <hr></hr>
          <div className="py-3 flex w-full justify-between items-center">
            <div className="flex items-center">
              <FaUserTie className="mr-2" />
              <strong>CEO</strong>
            </div>{" "}
            <a
              href={`https://www.google.com/search?q=${companyData.ceo}&hl=en`}
              target="_blank"
              className="text-blue-500 font-medium"
            >
              {companyData.ceo}
            </a>
          </div>
          <hr></hr>
          <div className="py-3 flex w-full items-center justify-between">
            <div className="flex items-center">
              <FaBuilding className="mr-2" />
              <strong>HEADQUARTERS</strong>
            </div>
            <a
              href={`https://www.google.com/maps/search/${companyData.address}+${companyData.city}`}
              target="_blank"
              className="flex flex-col items-end text-blue-500 font-medium"
            >
              <p>{companyData.address}</p>
              <p>{companyData.city}</p>
            </a>
          </div>
          <hr></hr>
          <div className="py-3 flex w-full justify-between items-center">
            <div className="flex items-center">
              <FaGlobe className="mr-2" />
              <strong>WEBSITE</strong>
            </div>{" "}
            <a
              href={companyData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 font-medium"
            >
              {companyData.website}
            </a>
          </div>
          <hr></hr>
          <div className="py-3 flex w-full justify-between items-center">
            <div className="flex items-center">
              <FaUsers className="mr-2" />
              <strong>EMPLOYEES</strong>
            </div>
            <p className="font-medium">{companyData.full_time_employees}</p>
          </div>
        </div>
      )}
    </Details>
  );
};

export default CompanyAboutSection;
