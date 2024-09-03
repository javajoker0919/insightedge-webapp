"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { FaArrowRight } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import OpportunitiesSection from "../../../components/company/opportunity/OpportunitiesSection";
import IncomeStatementSection from "../../../components/company/income-statement/IncomeStatementSection";
import RecentNewsSection from "../../../components/company/RecentNewsSection";
import YearQuarterSelector, { YearQuarter } from "./YearQuarterSelector";
import SummarySection from "../../../components/company/summary/SummarySection";
import AboutSection from "./AboutSection";
import { FollowButton, ShareButton } from "./components";
import MarketingStrategySection from "../../../components/company/marketing/MarketingStrategySection";
import { getMixPanelClient } from "@/utils/mixpanel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface CompanyData {
  id: string;
  symbol: string;
  name: string;
  description: string;
  website: string;
  address: string;
  city: string;
  ceo: string;
  full_time_employees: number;
}

const CompanyDetailPage: React.FC = () => {
  const { id: companyID } = useParams<{ id: string }>();
  const mixpanel = getMixPanelClient();

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [yearQuarters, setYearQuarters] = useState<YearQuarter[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [selectedETID, setSelectedETID] = useState<number | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState<boolean>(true);
  const [isLoadingYearQuarters, setIsLoadingYearQuarters] =
    useState<boolean>(true);

  const [jsonGS, setJsonGS] = useState<any | null>(null);
  const [jsonTS, setJsonTS] = useState<any | null>(null);
  const [jsonGO, setJsonGO] = useState<any[] | null>(null);
  const [jsonTO, setJsonTO] = useState<any[] | null>(null);
  const [jsonGM, setJsonGM] = useState<any[] | null>(null);
  const [jsonTM, setJsonTM] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", companyID)
          .single();

        if (error) throw error;
        setCompanyData(data as CompanyData);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoadingCompany(false);
      }
    };

    const fetchYearQuarters = async () => {
      try {
        const { data: yearQuarterData, error: yearQuarterError } =
          await supabase
            .from("earnings_transcripts")
            .select("year, quarter, date")
            .eq("company_id", companyID)
            .order("date", { ascending: false });

        if (yearQuarterError) throw yearQuarterError;
        setYearQuarters(yearQuarterData as YearQuarter[]);
      } catch (error) {
        console.error("Error fetching year quarters:", error);
      } finally {
        setIsLoadingYearQuarters(false);
      }
    };

    fetchCompanyData();
    fetchYearQuarters();
  }, [companyID]);

  useEffect(() => {
    if (!(!!companyID && !!selectedYear && !!selectedQuarter)) {
      return;
    }

    const fetchETID = async () => {
      try {
        const { data: yearQuarterData, error: yearQuarterError } =
          await supabase
            .from("earnings_transcripts")
            .select("id")
            .eq("company_id", companyID)
            .eq("year", selectedYear)
            .eq("quarter", selectedQuarter)
            .single();

        if (yearQuarterError) throw yearQuarterError;
        setSelectedETID(yearQuarterData.id);
      } catch (error) {
        console.error("Error fetching earnings transcript ID:", error);
      }
    };

    fetchETID();
  }, [companyID, selectedYear, selectedQuarter]);

  const handleExportAsJson = () => {
    if (
      jsonGS === null ||
      jsonTS === null ||
      jsonGO === null ||
      jsonTO === null ||
      jsonGM === null ||
      jsonTM === null
    ) {
      return;
    }

    const dataToExport = {
      summary: {
        general: jsonGS,
        tailored: jsonTS,
      },
      opportunity: {
        general: jsonGO,
        tailored: jsonTO,
      },
      marketing: {
        general: jsonGM,
        tailored: jsonTM,
      },
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyData?.name}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingCompany) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
          <h1>Loading</h1>
        </div>
      </div>
    );
  }

  if (!companyData) return <div>Company not found</div>;

  return (
    <div className="w-full p-4 h-full overflow-y-auto bg-white bg-opacity-50 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex text-sm items-center gap-2 text-gray-400">
            <Link
              href="/app"
              onClick={() => {
                mixpanel.track("goto.dashboard", {
                  $source: "company_page.home_button",
                });
              }}
              className="hover:underline"
            >
              Home
            </Link>
            <FaArrowRight className="w-3 h-3" />
            <p className="text-black">{companyData.symbol}</p>
          </div>

          <h1 className="text-2xl text-gray-800">{companyData.name}</h1>
        </div>

        <div className="flex space-x-2 items-center">
          <button
            onClick={handleExportAsJson}
            className="px-4 py-2 rounded-full bg-primary-500 text-white"
          >
            Export as Json
          </button>
          <FollowButton />
          <ShareButton etID={selectedETID} />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="h-full w-full space-y-4 overflow-hidden">
          <OpportunitiesSection
            companyName={companyData.name}
            etID={selectedETID}
            setJsonGO={setJsonGO}
            setJsonTO={setJsonTO}
          />
          <MarketingStrategySection
            companyName={companyData.name}
            etID={selectedETID}
            setJsonGM={setJsonGM}
            setJsonTM={setJsonTM}
          />
          <IncomeStatementSection companyID={parseInt(companyID)} />
          <RecentNewsSection companyID={parseInt(companyID)} />
        </div>

        <div className="xl:w-[30rem] w-96 h-full space-y-4 shrink-0">
          <YearQuarterSelector
            yearQuarters={yearQuarters}
            setSelectedYear={setSelectedYear}
            setSelectedQuarter={setSelectedQuarter}
            isLoading={isLoadingYearQuarters}
          />
          <SummarySection
            year={selectedYear}
            quarter={selectedQuarter}
            etID={selectedETID}
            setJsonGS={setJsonGS}
            setJsonTS={setJsonTS}
          />
          <AboutSection companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
