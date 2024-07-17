import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

interface OpportunitiesTableProps {
  companyName: string;
}

const OpportunitiesSection: React.FC<OpportunitiesTableProps> = () => {
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleGenerateOpportunities = () => {
    setIsLoading(true);
    setIsGenerated(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <h3 className="px-4 py-3 font-medium text-gray-700 bg-gray-50">
        Opportunities
      </h3>

      <div className="overflow-x-auto overflow-y-auto max-h-[1200px] text-sm">
        {isLoading ? (
          <div className="px-4 py-10 w-full flex justify-center">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          </div>
        ) : isGenerated ? (
          <table className="w-full relative border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-gray-200 text-black">
                <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
                  Opportunity
                </th>
                <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
                  Score
                </th>
                <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
                  Target Buyer Role
                </th>
                <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
                  Target Buyer Department
                </th>
                <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
                  Prospecting Tactics
                </th>
                <th className="px-4 py-3 text-center font-medium w-36 border-x border-gray-300"></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {opportunities.map((opp, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 border text-left border-gray-300">
                    {opp.opportunityName}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
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
                  <td className="px-4 py-3 border border-gray-300">
                    {opp.targetBuyer.role}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {opp.targetBuyer.department}
                  </td>
                  <td className="px-4 text-left py-3 border border-gray-300">
                    <ul className="list-none space-y-1">
                      {opp.engagementTips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <span className="mr-2 text-indigo-500">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        opp.targetBuyer.role
                      )}+${encodeURIComponent(
                        opp.targetBuyer.department
                      )}+"LinkedIn"`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-white font-semibold justify-center border-indigo-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-indigo-500"
                    >
                      Find Buyer
                      <FaExternalLinkAlt />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-10 w-full flex justify-center">
            <button
              onClick={handleGenerateOpportunities}
              className="w-full text-base px-4 max-w-96 py-2 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Generate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesSection;
