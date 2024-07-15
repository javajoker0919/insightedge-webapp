"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
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

import "swiper/css";
import "swiper/css/navigation";
import { FaBuilding, FaGlobe, FaUserTie, FaUsers } from "react-icons/fa";

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

const CompanyDetailPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

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

        // Fetch news items
        const { data: newsData, error: newsError } = await supabase
          .from("stock_news_sentiments")
          .select("published_date, title, image, url")
          .eq("company_id", companyId)
          .order("published_date", { ascending: false });

        console.log(newsData);

        if (newsError) throw newsError;
        setNewsItems(newsData as NewsItem[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (isLoading)
    return (
      <div className="flex w-full h-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          <h1>Loading</h1>
        </div>
      </div>
    );
  if (!companyData) return <div>Company not found</div>;

  return (
    <div className="w-full p-6 h-full overflow-y-auto bg-indigo-50 bg-opacity-50 flex flex-col gap-6">
      <h1 className="text-3xl text-gray-800">{companyData.name}</h1>
      <div className="flex gap-6 items-start">
        <div className="w-3/5 h-full">
          <IncomeStatementSection />
          <OpportunitiesTable />
          <RecentNewsSection newsItems={newsItems} />
        </div>
        <div className="flex-1 h-full space-y-4">
          <YearQuarterSelector />
          <SpecificSummarySection />
          <GeneralSummarySection />
          <AboutSection companyData={companyData} />
        </div>
      </div>
    </div>
  );
};

const IncomeStatementSection: React.FC = () => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6"
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

const OpportunitiesTable: React.FC = () => {
  const opportunities = [
    {
      opportunity: "Cloud Migration",
      score: 85,
      buyerRole: "CTO",
      buyerDepartment: "IT",
      tips: "Focus on cost savings and scalability",
    },
    {
      opportunity: "Data Analytics",
      score: 78,
      buyerRole: "CDO",
      buyerDepartment: "Data Science",
      tips: "Emphasize improved decision-making capabilities",
    },
    // Add more opportunities as needed
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
      <h3 className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
        Opportunities
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Opportunity</th>
              <th className="px-4 py-2 text-left">Opportunity Score</th>
              <th className="px-4 py-2 text-left">Target Buyer Role</th>
              <th className="px-4 py-2 text-left">Target Buyer Department</th>
              <th className="px-4 py-2 text-left">Tips & Tricks</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-4 py-2">{opp.opportunity}</td>
                <td className="px-4 py-2">{opp.score}</td>
                <td className="px-4 py-2">{opp.buyerRole}</td>
                <td className="px-4 py-2">{opp.buyerDepartment}</td>
                <td className="px-4 py-2">{opp.tips}</td>
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
}

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ newsItems }) => {
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
    </div>
  );
};

const YearQuarterSelector: React.FC = () => (
  <div className="flex space-x-4">
    <SelectInput
      options={[...Array(10)].map((_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
      })}
      placeholder="Select Year"
    />
    <SelectInput
      options={["Q1", "Q2", "Q3", "Q4"].map((quarter) => ({
        value: quarter,
        label: quarter,
      }))}
      placeholder="Select Quarter"
    />
  </div>
);

interface SelectInputProps {
  options: SelectOption[];
  placeholder: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ options, placeholder }) => (
  <select
    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none cursor-pointer"
    defaultValue=""
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {options.map(({ value, label }) => (
      <option key={value} value={value} className="text-gray-700">
        {label}
      </option>
    ))}
  </select>
);

const GenerateButton: React.FC = () => (
  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">
    User Specific Summary - Generate
  </button>
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
      <GenerateButton />
    </div>
  </details>
);

const GeneralSummarySection: React.FC = () => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      Summary
    </summary>
    <div className="px-4 py-3">
      {["Priorities", "Challenges", "Pain Points", "Opportunities"].map(
        (title) => (
          <SummaryItem key={title} title={title} />
        )
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
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title }) => (
  <details
    className="mb-2 bg-gray-50 overflow-hidden rounded border border-gray-200"
    open
  >
    <summary className="px-3 py-2 cursor-pointer text-gray-600 hover:bg-gray-100">
      {title}
    </summary>
    <div className="px-3 py-2 text-gray-700">{title} content goes here...</div>
  </details>
);

export default CompanyDetailPage;
