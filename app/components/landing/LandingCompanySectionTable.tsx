import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import LandingCompanySectionOpportunity from "./LandingComapnySectionOpportunity";
import Loading from "../Loading";

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
    <button
      onClick={() => setActiveTab(value)}
      className={`px-6 pt-3 pb-4 rounded-t-lg text-gray-700 ${
        activeTab === value ? "bg-gray-50" : "hover:bg-gray-100"
      }`}
    >
      {title}
    </button>
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
    <ul className="list-disc py-4 pl-10 pr-4 text-gray-700 text-md space-y-2">
      {contents.split("\n").map((item, index) => {
        return <li key={`landing-company-${type}-${index}`}>{item}</li>;
      })}
    </ul>
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
    <div className="max-w-6xl mt-16 border rounded-lg overflow-hidden w-full">
      <div className="bg-gray-200 flex items-center gap-1.5 px-2 pt-1.5 pb-0">
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
      <div className="bg-gray-50 h-96 overflow-y-auto">
        {isFetchingGO || isFetchingGS ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default LandingCompanySectionTable;
