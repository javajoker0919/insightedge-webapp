"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

import { supabase } from "@/utils/supabaseClient";
import { getMixPanelClient } from "@/utils/mixpanel";

import CompanyFollowButton from "./CompanyFollowButton";
import CompanyDateSelector from "./CompanyDateSelector";
import CompanyModuleSection from "./module/CompanyModuleSection";
import CompanyIncomeStatementSection from "./income-statement/IncomeStatementSection";
import CompanyAboutSection from "./CompanyAboutSection";
import CompanyNewsSection from "./CompanyNewsSection";

import { Loading, NoDataSection } from "../../";

export interface CompanyDataProps {
  id: string;
  symbol: string;
  name: string;
}

const CompanyPage: React.FC = () => {
  const { id: companyIDString } = useParams<{ id: string }>();
  const companyID = parseInt(companyIDString);
  const mixpanel = getMixPanelClient();
  const router = useRouter();

  const [companyData, setCompanyData] = useState<CompanyDataProps | null>(null);
  const [selectedETID, setSelectedETID] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (companyID) {
      fetchCompanyData(companyID);
    }
  }, [companyID]);

  const fetchCompanyData = async (companyID: number) => {
    setIsFetching(true);

    try {
      const { data, error } = await supabase
        .from("companies")
        .select(`id, symbol, name`)
        .eq("id", companyID)
        .single();

      if (error) throw error;

      if (data) {
        setCompanyData(data as CompanyDataProps);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleHomeClick = () => {
    mixpanel.track("goto.dashboard", {
      $source: "company_page.home_button",
    });

    router.push("/app");
  };

  if (isFetching) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Loading />
          <h1>Loading</h1>
        </div>
      </div>
    );
  } else if (companyData == null) {
    return <NoDataSection content="There is no company found" />;
  } else {
    return (
      <div className="w-full p-4 h-full overflow-y-auto bg-white bg-opacity-50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex text-sm items-center gap-2 text-gray-400">
              <button onClick={handleHomeClick} className="hover:underline">
                Home
              </button>
              <FaArrowRight className="w-3 h-3" />
              <p className="text-black">{companyData.symbol}</p>
            </div>

            <h1 className="text-2xl text-gray-800">{companyData.name}</h1>
          </div>

          <CompanyFollowButton />
        </div>

        <div className="flex gap-4 w-full">
          <div className="h-full w-full space-y-4 overflow-hidden">
            <CompanyModuleSection
              companyID={companyID}
              companyName={companyData.name}
              etID={selectedETID}
            />
            <CompanyIncomeStatementSection companyID={companyID} />
            <CompanyNewsSection companyID={companyID} />
          </div>

          <div className="xl:w-[30rem] w-96 h-full space-y-4 shrink-0">
            <CompanyDateSelector
              companyID={companyID}
              setETID={setSelectedETID}
            />
            <CompanyAboutSection companyID={companyID} />
          </div>
        </div>
      </div>
    );
  }
};

export default CompanyPage;
