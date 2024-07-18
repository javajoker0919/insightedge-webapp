import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

import Modal from "@/app/components/Modal";
import { generalOpportunities, tailoredOpportunities } from "./Constants";

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
          <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-10">
            Score
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-1/6">
            Target Buyer Role
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-52">
            Target Buyer Department
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-64">
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
