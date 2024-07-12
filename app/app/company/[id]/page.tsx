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
import "swiper/css";

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
  // Add other properties as needed
}

interface SelectOption {
  value: string;
  label: string;
}

const CompanyDetailPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  if (isLoading) return <div>Loading...</div>;
  if (!companyData) return <div>Company not found</div>;

  return (
    <div className="w-full p-6 h-full overflow-y-auto bg-indigo-50 bg-opacity-50 flex flex-col gap-6">
      <h1 className="text-3xl text-gray-800">{companyData.name}</h1>
      <div className="flex gap-6 items-start">
        <div className="w-3/5 h-full">
          <IncomeStatementSection />
          <OpportunitiesTable />
          <RecentNewsSection />
        </div>
        <div className="flex-1 h-full space-y-4">
          <YearQuarterSelector />
          <SpecificSummarySection />
          <GeneralSummarySection />
          <AboutSection />
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
    <div className="px-4 py-3" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <QuarterlyChart />
    </div>
    <div className="px-4 py-3">
      <FinancialTable />
    </div>
  </details>
);

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

const RecentNewsSection: React.FC = () => {
  const news = [
    { title: "Company X Launches New Product", date: "2023-05-15" },
    { title: "Q2 Earnings Report Released", date: "2023-07-30" },
    { title: "Strategic Partnership Announced", date: "2023-08-10" },
    // Add more news items as needed
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <h3 className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
        Recent News
      </h3>
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
      >
        {news.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="p-4">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

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
  <select className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none cursor-pointer">
    <option value="" disabled selected>
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

const AboutSection: React.FC = () => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      About
    </summary>
    <div className="px-3 py-2 text-gray-700">About content goes here...</div>
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
