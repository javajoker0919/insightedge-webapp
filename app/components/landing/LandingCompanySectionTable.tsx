import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import LandingCompanySectionOpportunity from "./LandingComapnySectionOpportunity";
import Loading from "../Loading";
import { motion } from "framer-motion";

interface CompanyData {
  id: string;
  summary: string;
  pain_points: string;
  challenges: string;
  opportunities: string;
}

export interface OpportunityData {
  buyer_department: string;
  buyer_role: string;
  company_name: string;
  email_body: string;
  email_subject: string;
  engagement_inbounds: number;
  engagement_outbounds: number;
  keywords: string;
  name: string;
  reasoning: string;
  score: number;
  symbol: string;
}

interface Props {
  companyID: number | null;
}

interface TabProps {
  title: string;
  value: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Tab: React.FC<TabProps> = ({ title, value, activeTab, setActiveTab }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveTab(value)}
      className={`px-4 py-3 text-sm sm:text-base font-semibold transition-all duration-300 ${
        activeTab === value
          ? "bg-white text-gray-800"
          : "text-gray-700 hover:text-gray-900 hover:bg-blue-700"
      }`}
    >
      {title}
    </motion.button>
  );
};

interface ContentListProps {
  type: string;
  contents: string;
}

const ContentList: React.FC<ContentListProps> = ({ type, contents }) => {
  if (!contents) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400 text-4xl">
        No data
      </div>
    );
  }

  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="list-disc py-4 pl-10 pr-4 text-gray-700 text-md space-y-2"
    >
      {contents.split("\n").map((item, index) => {
        return (
          <motion.li
            key={`landing-company-${type}-${index}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {item}
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

const LandingCompanySectionTable: React.FC<Props> = ({ companyID }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("opportunities");

  const [isFetchingGS, setIsFetchingGS] = useState<boolean>(false);
  const [isFetchingGO, setIsFetchingGO] = useState<boolean>(false);

  const TabItems = [
    {
      value: "opportunities",
      title: "Opportunities",
    },
    {
      value: "summary",
      title: "Summary",
    },
    {
      value: "pain_points",
      title: "Pain Points",
    },
    {
      value: "challenges",
      title: "Challenges",
    },
    {
      value: "key_initiatives",
      title: "Key Initiatives",
    },
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
      .select("id, summary, pain_points, challenges, opportunities")
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
        buyer_department,
        buyer_role,
        company_name,
        email_body,
        email_subject,
        engagement_inbounds,
        engagement_outbounds,
        keywords,
        name,
        reasoning,
        score,
        symbol
        `
      )
      .eq("company_id", companyID);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setOpportunities(data.length > 1 ? data : []);
    }
    setIsFetchingGO(false);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mt-8 sm:mt-16 border-2 border-gray-200 rounded-lg overflow-hidden w-full shadow-lg bg-[#004AAD]"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2 pt-1 sm:pt-1.5 pb-0 overflow-x-auto">
        {TabItems.map(({ value, title }, index) => {
          return (
            <Tab
              key={`${value}-${index}`}
              title={title}
              value={value}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          );
        })}
      </div>
      <div className="bg-white h-64 sm:h-96 overflow-y-auto">
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
              <LandingCompanySectionOpportunity opportunities={opportunities} />
            )}
            {activeTab === "summary" && companyData && (
              <ContentList type="summary" contents={companyData.summary} />
            )}
            {activeTab === "pain_points" && companyData && (
              <ContentList
                type="pain_points"
                contents={companyData.pain_points}
              />
            )}
            {activeTab === "challenges" && companyData && (
              <ContentList
                type="challenges"
                contents={companyData.challenges}
              />
            )}
            {activeTab === "key_initiatives" && companyData && (
              <ContentList
                type="key_initiatives"
                contents={companyData.opportunities}
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LandingCompanySectionTable;
