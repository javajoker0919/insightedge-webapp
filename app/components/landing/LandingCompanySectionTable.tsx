import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabaseClient";
import LandingCompanySectionOpportunity from "./LandingCompanySectionOpportunity";
import Loading from "../Loading";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { getMixPanelClient } from "@/utils/mixpanel";

type CompanyData = {
  id: string;
  name: string;
  summary?: string;
  pain_points?: string[] | string;
  challenges?: string[] | string;
  opportunities?: string[] | string;
};

export interface OpportunityData {
  name: string;
  buyer_role: string;
  buyer_department: string;
  reasoning: string;
  score: number;
  company_name: string;
}

interface Props {
  companyID: number | null;
  ExportMenu?: React.FC<{
    companyData: CompanyData | null;
    opportunities: OpportunityData[];
  }>;
}

interface TabProps {
  title: string;
  value: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Tab: React.FC<TabProps> = ({ title, value, activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center relative">
      <button
        onClick={() => setActiveTab(value)}
        className={`px-4 py-3 text-sm sm:text-base font-semibold transition-all duration-300 ${
          activeTab === value
            ? "bg-white text-gray-800"
            : "text-white hover:text-gray-100 hover:font-bold"
        }`}
      >
        {title}
      </button>
      <div className="h-5 w-px bg-white/30 absolute right-0 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
};

interface ContentListProps {
  type: string;
  contents: string | string[];
}

const ContentList: React.FC<ContentListProps> = ({ type, contents }) => {
  const contentArray = Array.isArray(contents)
    ? contents
    : contents.split("\n");
  const filteredContent = contentArray.filter((item) => item.trim() !== "");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-3 px-3 sm:px-4 relative"
    >
      <ul className="space-y-2 text-gray-700">
        {filteredContent.map((item, index) => (
          <motion.li
            key={`landing-company-${type}-${index}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-md p-2 sm:p-3 shadow-sm border border-gray-300 flex items-center"
          >
            <span className="text-blue-500 mr-2 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="text-sm sm:text-base leading-snug">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const DefaultExportMenu: React.FC<{
  companyData: CompanyData | null;
  opportunities: OpportunityData[];
}> = ({ companyData, opportunities }) => {
  const mixpanel = getMixPanelClient();

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const exportAsJSON = () => {
    const data = { companyData, opportunities };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "company_data.json";
    link.click();
    setIsOpen(false);
  };

  const exportAsPDF = () => {
    if (!companyData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to export the PDF");
      return;
    }

    const formatContent = (content: string | string[] | undefined) => {
      if (!content) return "";
      const items = Array.isArray(content) ? content : content.split("\n");
      return items
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `<li>${item}</li>`)
        .join("");
    };

    let htmlContent = `
      <html>
        <head>
          <title>${companyData.name} Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
              line-height: 1.4;
            }
            .logo {
              max-width: 200px;
              margin-bottom: 20px;
            }
            h1 {
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            h2 {
              color: #2980b9;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 18px;
            }
            ul {
              margin: 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 5px;
            }
            .section {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <img src="/logo.png" alt="ProspectEdge" class="logo" />
          <h1>${companyData.name} Summary</h1>
          <div class="section">
            <h2>Summary</h2>
            <ul>${formatContent(companyData.summary)}</ul>
          </div>
          <div class="section">
            <h2>Pain Points</h2>
            <ul>${formatContent(companyData.pain_points)}</ul>
          </div>
          <div class="section">
            <h2>Challenges</h2>
            <ul>${formatContent(companyData.challenges)}</ul>
          </div>
          <div class="section">
            <h2>Key Initiatives</h2>
            <ul>${formatContent(companyData.opportunities)}</ul>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    setIsOpen(false);
  };

  const exportAsCSV = () => {
    if (!opportunities || opportunities.length === 0) return;

    mixpanel.track("export.csv", {
      $source: "landing_page",
    });

    const headers = [
      "Opportunity Name",
      "Score",
      "Buyer Role",
      "Buyer Department",
      "Company Name",
    ];

    const csvContent = [
      headers.join(","),
      ...opportunities.map((opp) =>
        [
          opp.name,
          opp.score,
          opp.buyer_role,
          opp.buyer_department,
          opp.company_name,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "opportunities.csv";
    link.click();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={popupRef}
              className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Export Options
              </h3>
              <div className="space-y-3">
                <ExportOption
                  onClick={exportAsJSON}
                  title="Export as JSON"
                  description="All company and opportunity data"
                  icon={<JsonIcon />}
                />
                <ExportOption
                  onClick={exportAsPDF}
                  title="Export as PDF"
                  description="Company information only"
                  icon={<PdfIcon />}
                />
                <ExportOption
                  onClick={exportAsCSV}
                  title="Export as CSV"
                  description="Opportunity information only"
                  icon={<CsvIcon />}
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

const ExportOption: React.FC<{
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ onClick, title, description, icon }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center space-x-3"
  >
    <div className="text-gray-400">{icon}</div>
    <div>
      <span className="font-medium text-gray-800">{title}</span>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  </button>
);

const JsonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zm0 0V5"
    />
  </svg>
);

const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zm0 0V5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 7h6m-6 4h6m-6 4h6"
    />
  </svg>
);

const CsvIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const LandingCompanySectionTable: React.FC<Props> = ({
  companyID,
  ExportMenu,
}) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("opportunities");

  const [isFetchingGS, setIsFetchingGS] = useState<boolean>(false);
  const [isFetchingGO, setIsFetchingGO] = useState<boolean>(false);

  const TabItems = [
    { value: "opportunities", title: "Opportunities" },
    { value: "summary", title: "Summary" },
    { value: "pain_points", title: "Pain Points" },
    { value: "challenges", title: "Challenges" },
    { value: "key_initiatives", title: "Key Initiatives" },
  ];

  useEffect(() => {
    if (companyID) {
      fetchSummary(companyID);
      fetchOpportunity(companyID);
    }
  }, [companyID]);

  const fetchSummary = async (companyID: number) => {
    setIsFetchingGS(true);
    const { data, error } = await supabase
      .from("companies_with_summaries_view_v1")
      .select("id, name, summary, pain_points, challenges, opportunities")
      .eq("id", companyID)
      .single();

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setCompanyData(data);
    }
    setIsFetchingGS(false);
  };

  const fetchOpportunity = async (companyID: number) => {
    setIsFetchingGO(true);
    const { data, error } = await supabase
      .from("general_opportunities_view_v1")
      .select(
        `
        name,
        buyer_role,
        buyer_department,
        reasoning,
        score,
        company_name
      `
      )
      .eq("company_id", companyID);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setOpportunities(data.length > 0 ? data : []);
    }
    setIsFetchingGO(false);
  };

  const ActualExportMenu = ExportMenu || DefaultExportMenu;

  return (
    <div className="max-w-6xl mt-8 sm:mt-16 overflow-hidden w-full">
      <div className="border border-gray-200 rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 flex items-center justify-between px-1 sm:px-2 pt-1 sm:pt-1.5 pb-0 overflow-x-auto relative">
          <div className="flex items-center flex-grow">
            {TabItems.map(({ value, title }, index) => (
              <Tab
                key={`${value}-${index}`}
                title={title}
                value={value}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ))}
          </div>
          <div className="flex-shrink-0">
            <ActualExportMenu
              companyData={companyData}
              opportunities={opportunities}
            />
          </div>
        </div>
        <div className="h-48 sm:h-[calc(100vh-300px)] overflow-y-auto">
          {isFetchingGO || isFetchingGS ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === "opportunities" && (
                <LandingCompanySectionOpportunity
                  opportunities={opportunities}
                />
              )}
              {activeTab === "summary" && companyData && (
                <ContentList
                  type="summary"
                  contents={companyData.summary || ""}
                />
              )}
              {activeTab === "pain_points" &&
                companyData &&
                companyData.pain_points && (
                  <ContentList
                    type="pain_points"
                    contents={companyData.pain_points}
                  />
                )}
              {activeTab === "challenges" &&
                companyData &&
                companyData.challenges && (
                  <ContentList
                    type="challenges"
                    contents={companyData.challenges}
                  />
                )}
              {activeTab === "key_initiatives" &&
                companyData &&
                companyData.opportunities && (
                  <ContentList
                    type="key_initiatives"
                    contents={companyData.opportunities}
                  />
                )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingCompanySectionTable;
