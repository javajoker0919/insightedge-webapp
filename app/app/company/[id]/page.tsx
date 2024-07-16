"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import {
  FaArrowRight,
  FaBuilding,
  FaGlobe,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useAtomValue } from "jotai";

import "swiper/css";
import "swiper/css/navigation";

import { watchlistAtom } from "@/utils/atoms";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CompanyData {
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

interface SelectOption {
  value: string;
  label: string;
}

interface NewsItem {
  published_date: string;
  title: string;
  image: string;
  url: string;
}

interface YearQuarter {
  year: number;
  quarter: number;
}

interface TranscriptData {
  summary: string;
  challenges: string;
  pain_points: string;
  opportunities: string;
  priorities: string;
}

const CompanyDetailPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [yearQuarters, setYearQuarters] = useState<YearQuarter[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(
    null
  );
  const [isLoadingCompany, setIsLoadingCompany] = useState<boolean>(true);
  const [isLoadingYearQuarters, setIsLoadingYearQuarters] =
    useState<boolean>(true);
  const [isLoadingGeneralSummary, setIsLoadingGeneralSummary] =
    useState<boolean>(false);
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
            .select("year, quarter")
            .eq("company_id", companyId)
            .order("year", { ascending: true })
            .order("quarter", { ascending: true });

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
    const fetchTranscriptData = async () => {
      if (selectedYear && selectedQuarter) {
        setIsLoadingGeneralSummary(true);
        try {
          const { data, error } = await supabase
            .from("earnings_transcripts")
            .select(
              "summary, challenges, pain_points, opportunities, priorities"
            )
            .eq("company_id", companyId)
            .eq("year", selectedYear)
            .eq("quarter", selectedQuarter)
            .single();

          if (error) throw error;
          setTranscriptData(data as TranscriptData);
        } catch (error) {
          console.error("Error fetching transcript data:", error);
          setTranscriptData(null);
        } finally {
          setIsLoadingGeneralSummary(false);
        }
      }
    };

    fetchTranscriptData();
  }, [companyId, selectedYear, selectedQuarter]);

  if (isLoadingCompany) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          <h1>Loading</h1>
        </div>
      </div>
    );
  }

  if (!companyData) return <div>Company not found</div>;

  return (
    <div className="w-full p-4 h-full overflow-y-auto bg-indigo-50 bg-opacity-50 flex flex-col gap-4">
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
      <div className="flex gap-4 items-start">
        <div className="w-3/5 h-full space-y-4">
          <OpportunitiesTable companyName={companyData.name} />
          <IncomeStatementSection />
          <RecentNewsSection newsItems={newsItems} isLoading={isLoadingNews} />
        </div>
        <div className="flex-1 h-full space-y-4">
          <YearQuarterSelector
            yearQuarters={yearQuarters}
            setSelectedYear={setSelectedYear}
            setSelectedQuarter={setSelectedQuarter}
            isLoading={isLoadingYearQuarters}
          />
          <SpecificSummarySection />
          <GeneralSummarySection
            transcriptData={transcriptData}
            isLoading={isLoadingGeneralSummary}
          />
          <AboutSection companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

const IncomeStatementSection: React.FC = () => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      Income Statement
    </summary>
    <div className="px-4 py-3 max-w-[600px] mx-auto">
      <QuarterlyChart />
    </div>
    <div className="px-4 py-3">
      <FinancialTable />
    </div>
  </details>
);

const QuarterlyChart = () => {
  const data = {
    labels: ["Apr 2023", "Jul 2023", "Sep 2023", "Dec 2023", "Mar 2024"],
    datasets: [
      {
        label: "Revenue",
        data: [95, 85, 95, 120, 100],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        barPercentage: 0.5, // Makes the bars thinner
        borderRadius: 5, // Rounds the corners of the bars
      },
      {
        label: "Net Income",
        data: [30, 25, 30, 40, 30],
        backgroundColor: "rgba(255, 206, 86, 0.8)",
        barPercentage: 0.5, // Makes the bars thinner
        borderRadius: 5, // Rounds the corners of the bars
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false, // Removes the x-axis dividing lines
        },
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 150,
        ticks: {
          callback: function (value: any) {
            return value + "B";
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
      },
    },
    barThickness: 20, // Sets a fixed width for the bars
    categoryPercentage: 0.8, // Adjusts the space between groups of bars
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

interface FinancialData {
  label: string;
  value: string | number;
  change: number;
}

const FinancialTable: React.FC = () => {
  const data: FinancialData[] = [
    { label: "Revenue", value: "90.75B", change: -4.31 },
    { label: "Operating expense", value: "14.37B", change: 5.22 },
    { label: "Net income", value: "23.64B", change: -2.17 },
    { label: "Net profit margin", value: 26.04, change: 2.2 },
    { label: "Earnings per share", value: 1.53, change: 0.66 },
    { label: "EBITDA", value: "30.74B", change: -1.54 },
  ];

  return (
    <div className="mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">(USD)</th>
            <th className="text-right p-2">MAR 2024</th>
            <th className="text-right p-2">Y/Y CHANGE</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.label}</td>
              <td className="text-right p-2">{item.value}</td>
              <td
                className={`text-right p-2 ${
                  item.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.change >= 0 ? "↑" : "↓"}
                {Math.abs(item.change).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface OpportunitiesTableProps {
  companyName: string;
}

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = () => {
  const opportunities = [
    {
      opportunityName:
        "Develop comprehensive RWE strategy for olanzapine LAI post-approval studies",
      opportunityScore: 95,
      targetBuyer: {
        role: "Head of Real-World Evidence",
        department: "R&D",
      },
      engagementTips: [
        "Create a personalized video showcasing Genesis Research's expertise in CNS RWE studies",
        "Reach out with a tailored proposal highlighting the benefits of partnering with Genesis Research",
      ],
    },
    {
      opportunityName:
        "Support HEOR evidence generation for olanzapine LAI global value dossiers",
      opportunityScore: 90,
      targetBuyer: {
        role: "Global HEOR Director",
        department: "Market Access",
      },
      engagementTips: [
        "Develop an interactive tool demonstrating the potential HEOR impact of olanzapine LAI",
        "Schedule a targeted presentation to showcase Genesis Research's HEOR capabilities",
      ],
    },
    {
      opportunityName:
        "Conduct payer research to inform olanzapine LAI pricing and access strategy",
      opportunityScore: 85,
      targetBuyer: {
        role: "Head of Global Pricing",
        department: "Commercial",
      },
      engagementTips: [
        "Create a personalized payer research proposal based on Teva's specific needs",
        "Initiate contact with a compelling case study demonstrating Genesis Research's payer research expertise",
      ],
    },
    {
      opportunityName:
        "Develop integrated evidence plan for Teva's Anti-IL15 program in Celiac disease",
      opportunityScore: 80,
      targetBuyer: {
        role: "Head of Immunology R&D",
        department: "R&D",
      },
      engagementTips: [
        "Host a webinar on innovative evidence generation strategies for rare diseases",
        "Reach out with a customized integrated evidence plan outline for Teva's Anti-IL15 program",
      ],
    },
    {
      opportunityName:
        "Conduct systematic literature review on IL-15 in Celiac disease pathophysiology",
      opportunityScore: 75,
      targetBuyer: {
        role: "Medical Director, Immunology",
        department: "Medical Affairs",
      },
      engagementTips: [
        "Provide a sample AI-powered literature review on IL-15 in autoimmune diseases",
        "Proactively share a targeted proposal for conducting a comprehensive literature review on IL-15",
      ],
    },
    {
      opportunityName:
        "Perform HTA landscaping for Teva's biosimilar portfolio in key markets",
      opportunityScore: 90,
      targetBuyer: {
        role: "Head of Global Biosimilars",
        department: "Commercial",
      },
      engagementTips: [
        "Develop a biosimilar HTA toolkit tailored to Teva's portfolio and target markets",
        "Initiate contact with a strategic HTA landscaping plan customized for Teva's biosimilar portfolio",
      ],
    },
    {
      opportunityName:
        "Develop payer engagement strategy for Teva's biosimilar portfolio",
      opportunityScore: 85,
      targetBuyer: {
        role: "Director of Biosimilar Market Access",
        department: "Market Access",
      },
      engagementTips: [
        "Create a personalized biosimilar payer engagement plan based on Teva's unique needs",
        "Reach out with a compelling case study showcasing Genesis Research's biosimilar market access expertise",
      ],
    },
    {
      opportunityName:
        "Design RWE studies to differentiate AJOVY in competitive migraine market",
      opportunityScore: 80,
      targetBuyer: {
        role: "Head of Migraine Franchise",
        department: "R&D",
      },
      engagementTips: [
        "Develop a custom RWE study protocol showcasing innovative designs for AJOVY",
        "Proactively share a targeted proposal for designing differentiated RWE studies for AJOVY",
      ],
    },
    {
      opportunityName:
        "Conduct market access landscape assessment for TEV-248 (ICS/SABA) in asthma",
      opportunityScore: 75,
      targetBuyer: {
        role: "Director of Respiratory Marketing",
        department: "Commercial",
      },
      engagementTips: [
        "Provide a complimentary market access landscape report for TEV-248's target markets",
        "Schedule a targeted presentation to showcase Genesis Research's asthma market access expertise",
      ],
    },
    {
      opportunityName:
        "Develop HEOR strategy for Teva's innovative CNS pipeline assets",
      opportunityScore: 85,
      targetBuyer: {
        role: "VP of CNS HEOR",
        department: "Market Access",
      },
      engagementTips: [
        "Create a personalized CNS HEOR strategy roadmap based on Teva's pipeline",
        "Reach out with a customized proposal for developing a comprehensive HEOR strategy for Teva's CNS assets",
      ],
    },
    {
      opportunityName:
        "Build integrated evidence plan for Teva's biosimilar Stelara (ustekinumab)",
      opportunityScore: 80,
      targetBuyer: {
        role: "Head of Biosimilar Medical Affairs",
        department: "Medical Affairs",
      },
      engagementTips: [
        "Develop a custom integrated evidence plan template tailored to biosimilar Stelara",
        "Proactively share a targeted proposal for building a robust evidence plan for biosimilar Stelara",
      ],
    },
    {
      opportunityName:
        "Conduct payer advisory boards to inform AUSTEDO growth strategy",
      opportunityScore: 90,
      targetBuyer: {
        role: "AUSTEDO Brand Lead",
        department: "Commercial",
      },
      engagementTips: [
        "Create a personalized payer advisory board agenda focusing on AUSTEDO's unique value proposition",
        "Initiate contact with a compelling case study demonstrating the impact of payer advisory boards",
      ],
    },
    {
      opportunityName:
        "Perform systematic literature review on TL1A in ulcerative colitis and Crohn's",
      opportunityScore: 70,
      targetBuyer: {
        role: "Medical Director, Gastroenterology",
        department: "Medical Affairs",
      },
      engagementTips: [
        "Provide a sample AI-powered literature review on TL1A in inflammatory bowel disease",
        "Reach out with a customized proposal for conducting a comprehensive literature review on TL1A",
      ],
    },
    {
      opportunityName:
        "Develop global value dossiers for Teva's innovative pipeline assets",
      opportunityScore: 85,
      targetBuyer: {
        role: "Head of Global Value & Access",
        department: "Market Access",
      },
      engagementTips: [
        "Create a custom global value dossier template tailored to Teva's pipeline assets",
        "Schedule a targeted presentation to showcase Genesis Research's value dossier development expertise",
      ],
    },
    {
      opportunityName:
        "Create integrated evidence roadmap for Teva's generic portfolio",
      opportunityScore: 75,
      targetBuyer: {
        role: "Head of Global Generic R&D",
        department: "R&D",
      },
      engagementTips: [
        "Develop a personalized integrated evidence roadmap for Teva's generic portfolio",
        "Proactively share a targeted proposal for creating a comprehensive evidence roadmap for Teva's generics",
      ],
    },
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <h3 className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
        Opportunities
      </h3>
      <div className="overflow-x-auto overflow-y-auto max-h-96 text-sm">
        <table className="w-full relative border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-gray-200 text-black">
              <th className="px-4 py-3 text-center font-medium">Opportunity</th>
              <th className="px-4 py-3 text-center font-medium">Score</th>
              <th className="px-4 py-3 text-center font-medium">
                Target Buyer Role
              </th>
              <th className="px-4 py-3 text-center font-medium">
                Target Buyer Department
              </th>
              <th className="px-4 py-3 text-center font-medium">
                Tips & Tricks
              </th>
              <th className="px-4 py-3 text-center font-medium">Search URL</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {opportunities.map((opp, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 border-b text-left border-gray-200">
                  {opp.opportunityName}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                      opp.opportunityScore >= 90
                        ? "bg-green-100 text-green-800"
                        : opp.opportunityScore >= 70
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {opp.opportunityScore}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {opp.targetBuyer.role}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {opp.targetBuyer.department}
                </td>
                <td className="px-4 text-left py-3 border-b border-gray-200">
                  <ul className="list-none space-y-1">
                    {opp.engagementTips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      opp.targetBuyer.role
                    )}+${encodeURIComponent(
                      opp.targetBuyer.department
                    )}+"LinkedIn"`}
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on Google
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface RecentNewsSectionProps {
  newsItems: NewsItem[];
  isLoading: boolean;
}

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({
  newsItems,
  isLoading,
}) => {
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const differenceInTime = now.getTime() - publishedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const differenceInYears = Math.floor(differenceInDays / 365);

    if (differenceInYears > 0) {
      return `${differenceInYears} year${differenceInYears > 1 ? "s" : ""} ago`;
    } else if (differenceInMonths > 0) {
      return `${differenceInMonths} month${
        differenceInMonths > 1 ? "s" : ""
      } ago`;
    } else if (differenceInWeeks > 0) {
      return `${differenceInWeeks} week${differenceInWeeks > 1 ? "s" : ""} ago`;
    } else if (differenceInDays > 0) {
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    } else {
      return "Today";
    }
  };

  return (
    <div className="bg-white space-y-2 border border-gray-300 rounded-lg overflow-hidden">
      <h3 className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
        Recent News
      </h3>
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          <h1>Loading News</h1>
        </div>
      ) : (
        <Swiper
          slidesPerView={3}
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          watchOverflow={false}
          spaceBetween={15}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          modules={[Navigation]}
          className="gap-2 items-center flex !py-5 !px-7"
        >
          <div className="swiper-button-prev border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          <div className="swiper-button-next border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          {newsItems.map((item, index) => (
            <SwiperSlide key={index}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex hover:shadow-md border border-transparent hover:border-gray-200 flex-col overflow-hidden rounded-lg"
              >
                <div className="w-full overflow-hidden">
                  <img
                    className="object-cover w-full"
                    src={
                      item.image ||
                      `https://picsum.photos/200/300?random=${index}`
                    }
                    alt={item.title}
                  />
                </div>
                <div className="p-3 border space-y-2 rounded-b-lg">
                  <h4 className="font-medium line-clamp-3">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {getTimeAgo(item.published_date)}
                  </p>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

const YearQuarterSelector: React.FC<{
  yearQuarters: YearQuarter[];
  setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedQuarter: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
}> = ({ yearQuarters, setSelectedYear, setSelectedQuarter, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (yearQuarters.length === 0) {
    return <></>;
  }

  const [year, setYear] = useState<number>(
    yearQuarters[yearQuarters.length - 1].year
  );

  useEffect(() => {
    setSelectedYear(yearQuarters[yearQuarters.length - 1].year);
    setSelectedQuarter(yearQuarters[yearQuarters.length - 1].quarter);
  }, [year]);

  return (
    <div className="flex space-x-4">
      <SelectInput
        defaultValue={yearQuarters[yearQuarters.length - 1].year}
        options={yearQuarters
          .map((yq) => yq.year)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map((year) => ({
            value: year.toString(),
            label: year.toString(),
          }))}
        onChange={(selectedYear: number) => {
          setSelectedYear(selectedYear);
          setYear(selectedYear);
        }}
      />
      {year && (
        <SelectInput
          defaultValue={yearQuarters[yearQuarters.length - 1].quarter}
          options={yearQuarters
            .filter((yq) => yq.year === year)
            .map((yq) => yq.quarter)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((quarter) => ({
              value: quarter.toString(),
              label: `Q${quarter}`,
            }))}
          onChange={(selectedQuarter: number) =>
            setSelectedQuarter(selectedQuarter)
          }
        />
      )}
    </div>
  );
};

interface SelectInputProps {
  defaultValue: number | undefined;
  options: SelectOption[];
  onChange: (selectedYear: number) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  defaultValue,
  options,
  onChange,
}) => (
  <select
    defaultValue={defaultValue}
    onChange={(e) => onChange(parseInt(e.target.value))}
    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none cursor-pointer"
  >
    {options.map(({ value, label }) => (
      <option key={value} value={value} className="text-gray-700">
        {label}
      </option>
    ))}
  </select>
);

const SpecificSummarySection: React.FC = () => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      User Specific Summary
    </summary>
    <div className="px-4 py-3">
      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">
        Generate
      </button>
    </div>
  </details>
);

interface GeneralSummarySectionProps {
  transcriptData: TranscriptData | null;
  isLoading: boolean;
}

const GeneralSummarySection: React.FC<GeneralSummarySectionProps> = ({
  transcriptData,
  isLoading,
}) => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      Summary
    </summary>
    <div className="px-4 py-3">
      {isLoading ? (
        <div className="flex justify-center items-center pb-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
        </div>
      ) : (
        <>
          <SummaryItem
            key={"Priorities"}
            title={"Priorities"}
            content={transcriptData?.["priorities"] || "No data"}
          />
          <SummaryItem
            key={"Challenges"}
            title={"Challenges"}
            content={transcriptData?.["challenges"] || "No data"}
          />
          <SummaryItem
            key={"Pain Points"}
            title={"Pain Points"}
            content={transcriptData?.["pain_points"] || "No data"}
          />
          <SummaryItem
            key={"Opportunities"}
            title={"Opportunities"}
            content={transcriptData?.["opportunities"] || "No data"}
          />
        </>
      )}
    </div>
  </details>
);

interface AboutSectionProps {
  companyData: CompanyData;
}

const AboutSection: React.FC<AboutSectionProps> = ({ companyData }) => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      About
    </summary>
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
  </details>
);

interface SummaryItemProps {
  title: string;
  content: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, content }) => (
  <details
    className="mb-2 bg-gray-50 overflow-hidden rounded border border-gray-200"
    open
  >
    <summary className="px-3 py-2 cursor-pointer text-base text-gray-600 hover:bg-gray-100">
      {title}
    </summary>
    <div className="px-3 py-2 text-gray-700 text-sm">{content}</div>
  </details>
);

export default CompanyDetailPage;
