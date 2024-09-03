import React, { useState, useMemo, FC } from "react";

import { OpportunityData } from "./LandingCompanySectionTable";

const LandingCompanySectionOpportunity: FC<{
  opportunities: OpportunityData[];
}> = ({ opportunities }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof OpportunityData;
    direction: "ascending" | "descending";
  }>({
    key: "score",
    direction: "descending",
  });

  const sortedOpportunities = useMemo(() => {
    const sortableOpportunities = [...opportunities];
    sortableOpportunities.sort((a, b) => {
      if (sortConfig.key === "score") {
        return sortConfig.direction === "ascending"
          ? a.score - b.score
          : b.score - a.score;
      }
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sortableOpportunities;
  }, [opportunities, sortConfig]);

  const requestSort = (key: keyof OpportunityData) => {
    setSortConfig((currentConfig) => {
      if (currentConfig.key === key) {
        return {
          key,
          direction:
            currentConfig.direction === "ascending"
              ? "descending"
              : "ascending",
        };
      }
      return { key, direction: "descending" };
    });
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
                <th className="px-2 sm:px-4 py-3 text-left font-medium border-x border-gray-300 w-[50%]">
                  Opportunity
                </th>
                <th
                  className="px-2 sm:px-4 py-3 text-center font-medium w-[10%]"
                  onClick={() => requestSort("score")}
                >
                  <div className="justify-center gap-1 flex items-center cursor-pointer">
                    <span>Score</span>
                    {/* Sort icon removed */}
                  </div>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-[15%]">
                  <span className="hidden sm:inline">Target Buyer Role</span>
                  <span className="sm:hidden">Role</span>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-[15%]">
                  <span className="hidden sm:inline">
                    Target Buyer Department
                  </span>
                  <span className="sm:hidden">Dept.</span>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center font-medium border-x border-gray-300 w-[10%]">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-center relative">
              {sortedOpportunities.map((opp, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-2 sm:px-4 py-3 border text-left border-gray-300 text-xs 2xl:text-sm">
                    {opp.name}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300 text-xs 2xl:text-sm">
                    {opp.score}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300 text-xs 2xl:text-sm">
                    {opp.buyer_role}
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300">
                    <span
                      className={`inline-block px-1 sm:px-2 py-1 rounded-2xl border text-xs 2xl:text-sm font-medium ${getDepartmentClass(
                        opp.buyer_department
                      )}`}
                    >
                      {opp.buyer_department}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 border border-gray-300">
                    <div className="flex justify-center">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          opp.company_name
                        )}+${encodeURIComponent(
                          opp.buyer_role
                        )}+${encodeURIComponent(
                          opp.buyer_department
                        )}+"LinkedIn"`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-white font-semibold border-primary-500 border flex items-center gap-1 rounded-full p-1 px-2 hover:bg-primary-500 text-xs 2xl:text-sm whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Find</span> Buyer
                        {/* Person icon removed */}
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="w-full h-full items-center flex justify-center absolute top-0 left-0">
                      <span className="text-4xl text-gray-400">No data</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full overflow-x-auto h-full">
          <table className="w-full border-collapse min-w-[800px] h-full">
            <thead>
              <tr className="bg-gray-100 text-black">
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
                  <div className="w-full p-4 sm:p-10 text-gray-400 text-4xl flex items-center justify-center">
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

export default LandingCompanySectionOpportunity;
