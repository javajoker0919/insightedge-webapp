import { useState } from "react";
import { IoBulb, IoPerson } from "react-icons/io5";
import { FaSort } from "react-icons/fa";

import { OpportunityProps } from "./WLOpportunitySection";

const OpportunitiesTable: React.FC<{
  opportunities: OpportunityProps[];
  onQuickAction: (opp: OpportunityProps) => void;
}> = ({ opportunities, onQuickAction }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (sortConfig !== null) {
      if (
        (a[sortConfig.key as keyof OpportunityProps] ?? "") <
        (b[sortConfig.key as keyof OpportunityProps] ?? "")
      ) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (
        (a[sortConfig.key as keyof OpportunityProps] ?? "") >
        (b[sortConfig.key as keyof OpportunityProps] ?? "")
      ) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getDepartmentClass = (department: string) => {
    const sum = department
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const classes = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-yellow-100 text-yellow-800",
      "bg-green-100 text-green-800",
      "bg-red-100 text-red-800",
      "bg-gray-100 text-gray-800",
    ];
    return classes[sum % classes.length];
  };

  return (
    <>
      {sortedOpportunities.length > 0 ? (
        <div className="w-full lg:w-[600px] xl:w-full">
          <table className="relative border-collapse min-w-[1200px] xl:min-w-[600px] overflow-x-auto">
            <thead className="sticky z-10 top-0">
              <tr className="bg-gray-100 text-black">
                <th
                  className="px-2 sm:px-4 py-3 text-center font-medium w-24 xl:w-1/12 2xl:w-32"
                  onClick={() => requestSort("companyName")}
                >
                  <div className="justify-center gap-1 flex items-center cursor-pointer">
                    <span className="hidden sm:inline">Company</span>
                    <span className="sm:hidden">Co.</span>
                    <FaSort />
                  </div>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300">
                  Opportunity
                </th>
                <th
                  className="px-2 sm:px-4 py-3 text-center font-medium w-16 sm:w-fit"
                  onClick={() => requestSort("opportunityScore")}
                >
                  <div className="justify-center gap-1 flex items-center cursor-pointer">
                    <span>Score</span>
                    <FaSort />
                  </div>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-24 sm:w-32">
                  <span className="hidden sm:inline">Target Buyer Role</span>
                  <span className="sm:hidden">Role</span>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-24 sm:w-32 2xl:w-64">
                  <span className="hidden sm:inline">
                    Target Buyer Department
                  </span>
                  <span className="sm:hidden">Dept.</span>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-32 xl:w-32 2xl:w-64">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-center relative">
              {sortedOpportunities.map((opp, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                    opportunities.length > 0 ? "" : "blur"
                  }`}
                >
                  <td className="px-2 sm:px-4 py-3 border border-gray-300 text-xs 2xl:text-sm">
                    {opp.companyName}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border text-left border-gray-300 text-xs 2xl:text-sm">
                    {opp.opportunityName}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300 text-xs 2xl:text-sm">
                    {opp.opportunityScore}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300 text-xs 2xl:text-sm">
                    {opp.targetBuyer.role}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300">
                    <span
                      className={`inline-block px-1 sm:px-2 py-1 rounded-2xl border text-xs 2xl:text-sm font-medium ${getDepartmentClass(
                        opp.targetBuyer.department
                      )}`}
                    >
                      {opp.targetBuyer.department}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300">
                    <div className="flex flex-col 2xl:flex-row justify-center space-y-2 2xl:space-y-0 2xl:space-x-2">
                      <button
                        onClick={() => onQuickAction(opp)}
                        className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500 text-xs 2xl:text-sm"
                      >
                        Prospect <IoBulb />
                      </button>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          opp.companyName
                        )}+${encodeURIComponent(
                          opp.targetBuyer.role
                        )}+${encodeURIComponent(
                          opp.targetBuyer.department
                        )}+"LinkedIn"`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500 text-xs 2xl:text-sm"
                      >
                        Find Buyer
                        <IoPerson />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="w-full h-full items-center flex justify-center absolute top-0 left-0">
                      <span className="text-2xl sm:text-4xl text-gray-600">
                        No data
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300">
                  Opportunity
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-16 sm:w-24">
                  Score
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-24 sm:w-32">
                  <span className="hidden sm:inline">Target Buyer Role</span>
                  <span className="sm:hidden">Role</span>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-24 sm:w-32">
                  <span className="hidden sm:inline">
                    Target Buyer Department
                  </span>
                  <span className="sm:hidden">Dept.</span>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-24 sm:w-32">
                  Company Name
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-32 sm:w-64">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6}>
                  <div className="w-full p-4 sm:p-10 text-gray-500 text-lg sm:text-xl flex items-center justify-center">
                    No data
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OpportunitiesTable;
