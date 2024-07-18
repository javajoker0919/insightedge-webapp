import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

import Modal from "@/app/components/Modal";

interface OpportunitiesTableProps {
  companyName: string;
}

const OpportunitiesTable: React.FC<{
  opportunities: any[];
  onQuickAction: (opp: any) => void;
}> = ({ opportunities, onQuickAction }) => {
  return (
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
          <th className="px-4 py-3 text-center font-medium w-60 border-x border-gray-300">
            Quick Actions
          </th>
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
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                  opp.targetBuyer.department === "R&D"
                    ? "bg-blue-100 text-blue-800"
                    : opp.targetBuyer.department === "Commercial"
                    ? "bg-purple-100 text-purple-800"
                    : opp.targetBuyer.department === "Market Access"
                    ? "bg-orange-100 text-orange-800"
                    : opp.targetBuyer.department === "Medical Affairs"
                    ? "bg-teal-100 text-teal-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {opp.targetBuyer.department}
              </span>
            </td>
            <td className="px-4 py-3 border border-gray-300">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => onQuickAction(opp)}
                  className="text-indigo-500 hover:text-white font-semibold justify-center border-indigo-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-indigo-500"
                >
                  Prospect 💡
                </button>

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
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const OpportunitiesSection: React.FC<OpportunitiesTableProps> = () => {
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"opportunities" | "summary">(
    "opportunities"
  );

  const generalOpportunities = [
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

  const tailoredOpportunities = [
    {
      opportunityName:
        "Develop AI-driven drug discovery platform for neurological disorders",
      opportunityScore: 95,
      targetBuyer: {
        role: "Chief Scientific Officer",
        department: "R&D",
      },
      engagementTips: [
        "Present a demo of the AI platform's capabilities in identifying novel drug targets",
        "Offer a pilot project to demonstrate the platform's effectiveness in Teva's specific research areas",
      ],
    },
    {
      opportunityName:
        "Implement blockchain technology for supply chain optimization",
      opportunityScore: 90,
      targetBuyer: {
        role: "VP of Supply Chain",
        department: "Operations",
      },
      engagementTips: [
        "Develop a case study showing potential cost savings and efficiency improvements",
        "Organize a workshop to demonstrate the blockchain solution's integration with existing systems",
      ],
    },
    {
      opportunityName:
        "Create personalized medicine program for respiratory diseases",
      opportunityScore: 88,
      targetBuyer: {
        role: "Head of Precision Medicine",
        department: "R&D",
      },
      engagementTips: [
        "Present a roadmap for implementing personalized medicine approaches in Teva's respiratory portfolio",
        "Offer to conduct a pilot study demonstrating the benefits of personalized treatment in asthma patients",
      ],
    },
    {
      opportunityName:
        "Develop digital therapeutics for mental health management",
      opportunityScore: 85,
      targetBuyer: {
        role: "Director of Digital Health",
        department: "Innovation",
      },
      engagementTips: [
        "Showcase a prototype of the digital therapeutic for depression or anxiety",
        "Propose a collaboration to integrate the digital therapeutic with Teva's existing CNS treatments",
      ],
    },
    {
      opportunityName:
        "Implement advanced analytics for real-time manufacturing optimization",
      opportunityScore: 82,
      targetBuyer: {
        role: "Head of Manufacturing",
        department: "Operations",
      },
      engagementTips: [
        "Provide a simulation demonstrating potential improvements in production efficiency",
        "Offer a site visit to a facility already using the advanced analytics system",
      ],
    },
    {
      opportunityName:
        "Develop gene therapy program for rare genetic disorders",
      opportunityScore: 80,
      targetBuyer: {
        role: "Head of Rare Diseases",
        department: "R&D",
      },
      engagementTips: [
        "Present a comprehensive overview of the gene therapy platform and its potential applications",
        "Propose a collaborative research project focusing on a specific rare genetic disorder",
      ],
    },
    {
      opportunityName: "Create AI-powered drug repurposing initiative",
      opportunityScore: 78,
      targetBuyer: {
        role: "Chief Innovation Officer",
        department: "R&D",
      },
      engagementTips: [
        "Demonstrate the AI system's ability to identify new indications for existing Teva drugs",
        "Offer a pilot project to validate the AI's predictions for a selected drug candidate",
      ],
    },
    {
      opportunityName:
        "Implement IoT-enabled smart packaging for improved patient adherence",
      opportunityScore: 75,
      targetBuyer: {
        role: "Head of Patient Solutions",
        department: "Commercial",
      },
      engagementTips: [
        "Showcase a prototype of the smart packaging solution and its companion app",
        "Propose a clinical study to measure the impact on patient adherence in a key therapeutic area",
      ],
    },
    {
      opportunityName:
        "Develop biosimilars using advanced protein engineering techniques",
      opportunityScore: 72,
      targetBuyer: {
        role: "Head of Biosimilars",
        department: "R&D",
      },
      engagementTips: [
        "Present case studies demonstrating the success of the protein engineering platform",
        "Offer to conduct a feasibility study for developing a high-value biosimilar in Teva's portfolio",
      ],
    },
    {
      opportunityName:
        "Create virtual clinical trial platform for decentralized studies",
      opportunityScore: 70,
      targetBuyer: {
        role: "Head of Clinical Operations",
        department: "R&D",
      },
      engagementTips: [
        "Provide a demo of the virtual clinical trial platform and its features",
        "Propose a pilot study to compare the efficiency of virtual vs. traditional clinical trials",
      ],
    },
  ];

  const handleGenerateOpportunities = () => {
    setIsLoading(true);
    setIsGenerated(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickAction = (opp: any) => {
    setSelectedOpportunity(opp);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="w-full flex items-center bg-gray-100 justify-between">
        {isGenerated && !isLoading ? (
          <div className="flex">
            <button
              onClick={() => setActiveTab("opportunities")}
              className={`px-4 py-4 border-indigo-600 border-b-2 ${
                activeTab === "opportunities"
                  ? "text-indigo-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              General Opportunities
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-4 border-indigo-600 border-b-2 ${
                activeTab === "summary"
                  ? "text-indigo-600 border-opacity-100"
                  : "text-gray-600 border-opacity-0 hover:border-gray-300 hover:border-opacity-100 hover:text-gray-900"
              }`}
            >
              Tailored Opportunities
            </button>
          </div>
        ) : (
          <div className="flex w-full justify-between items-center pr-4 py-1">
            <h3 className="px-4 py-3 font-medium text-gray-700">
              Opportunities
            </h3>
            <button
              onClick={handleGenerateOpportunities}
              disabled={isLoading}
              className="px-4 py-2 w-64 flex items-center justify-center text-sm bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
              ) : (
                "Generate Tailored Opportunities"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[700px] text-sm">
        <OpportunitiesTable
          opportunities={
            activeTab === "opportunities"
              ? generalOpportunities
              : tailoredOpportunities
          }
          onQuickAction={handleQuickAction}
        />
      </div>

      <Modal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      >
        <h4 className="text-lg font-bold mb-4">Prospecting Tactics</h4>
        <ul className="list-disc pl-5 mb-4">
          {selectedOpportunity?.engagementTips.map(
            (tip: string, index: number) => (
              <li key={index} className="mb-2">
                {tip}
              </li>
            )
          )}
        </ul>
      </Modal>
    </div>
  );
};

export default OpportunitiesSection;
