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
import { useAtomValue } from "jotai";

import { watchlistAtom } from "@/utils/atoms";
import OpportunitiesSection from "./components/opportunities/OpportunitiesSection";
import IncomeStatementSection from "./IncomeStatementSection";
import RecentNewsSection, { NewsItem } from "./RecentNewsSection";
import YearQuarterSelector, { YearQuarter } from "./YearQuarterSelector";
import SummarySection from "./components/summary/SummarySection";
import AboutSection from "./AboutSection";
import { FollowButton, ShareButton } from "./components";
import MarketingStrategySection from "./components/marketing/MarketingStrategySection";

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
  const { id: companyId } = useParams<{ id: string }>();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [yearQuarters, setYearQuarters] = useState<YearQuarter[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [selectedETID, setSelectedETID] = useState<number | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState<boolean>(true);
  const [isLoadingYearQuarters, setIsLoadingYearQuarters] =
    useState<boolean>(true);
  const [isFetchingETID, setIsFetchingETID] = useState<boolean>(true);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const watchlist = useAtomValue(watchlistAtom);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .single();

        if (error) throw error;
        setCompanyData(data as CompanyData);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoadingCompany(false);
      }
    };

    const fetchNewsItems = async () => {
      try {
        const { data: newsData, error: newsError } = await supabase
          .from("stock_news_sentiments")
          .select("published_date, title, image, url")
          .eq("company_id", companyId)
          .order("published_date", { ascending: false });

        if (newsError) throw newsError;
        setNewsItems(newsData as NewsItem[]);
      } catch (error) {
        console.error("Error fetching news items:", error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    const fetchYearQuarters = async () => {
      try {
        const { data: yearQuarterData, error: yearQuarterError } =
          await supabase
            .from("earnings_transcripts")
            .select("year, quarter, date")
            .eq("company_id", companyId)
            .order("date", { ascending: true });

        if (yearQuarterError) throw yearQuarterError;
        setYearQuarters(yearQuarterData as YearQuarter[]);
      } catch (error) {
        console.error("Error fetching year quarters:", error);
      } finally {
        setIsLoadingYearQuarters(false);
      }
    };

    fetchCompanyData();
    fetchNewsItems();
    fetchYearQuarters();
  }, [companyId]);

  useEffect(() => {
    if (!(!!companyId && !!selectedYear && !!selectedQuarter)) {
      return;
    }

    const fetchETID = async () => {
      setIsFetchingETID(true);

      try {
        const { data: yearQuarterData, error: yearQuarterError } =
          await supabase
            .from("earnings_transcripts")
            .select("id")
            .eq("company_id", companyId)
            .eq("year", selectedYear)
            .eq("quarter", selectedQuarter)
            .single();

        if (yearQuarterError) throw yearQuarterError;
        setSelectedETID(yearQuarterData.id);
      } catch (error) {
        console.error("Error fetching earnings transcript ID:", error);
      } finally {
        setIsFetchingETID(false);
      }
    };

    fetchETID();
  }, [companyId, selectedYear, selectedQuarter]);

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
    <div className="w-full p-4 h-full overflow-y-auto bg-primary-50 bg-opacity-50 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex text-sm items-center gap-2 text-gray-400">
            <Link
              href={`/app${
                watchlist?.[0]?.uuid ? `/watchlist/${watchlist[0].uuid}` : ""
              }`}
              className="hover:underline"
            >
              Home
            </Link>
            <FaArrowRight className="w-3 h-3" />
            <p className="text-black">{companyData.symbol}</p>
          </div>

          <h1 className="text-2xl text-gray-800">{companyData.name}</h1>
        </div>

        <div className="flex space-x-2">
          <FollowButton />
          <ShareButton />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="h-full w-full space-y-4 overflow-hidden">
          <OpportunitiesSection
            companyID={parseInt(companyId)}
            companyName={companyData.name}
            year={selectedYear}
            quarter={selectedQuarter}
          />
          <MarketingStrategySection
            companyName={companyData.name}
            etID={selectedETID}
            isLoading={isFetchingETID}
          />
          <IncomeStatementSection />
          <RecentNewsSection newsItems={newsItems} isLoading={isLoadingNews} />
        </div>

        <div className="xl:w-[30rem] w-96 h-full space-y-4 shrink-0">
          <YearQuarterSelector
            yearQuarters={yearQuarters}
            setSelectedYear={setSelectedYear}
            setSelectedQuarter={setSelectedQuarter}
            isLoading={isLoadingYearQuarters}
          />
          <SummarySection year={selectedYear} quarter={selectedQuarter} />
          <AboutSection companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
