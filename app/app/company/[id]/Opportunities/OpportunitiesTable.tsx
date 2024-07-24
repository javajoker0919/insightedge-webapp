import { IoBulb, IoPerson } from "react-icons/io5";
import { OpportunityProps } from "./OpportunitiesSection";
import { generalOpportunities } from "../Constants";

const OpportunitiesTable: React.FC<{
  companyName: string;
  opportunities: OpportunityProps[];
  onQuickAction: (opp: OpportunityProps) => void;
}> = ({ companyName, opportunities, onQuickAction }) => {
  const opps = opportunities.length > 0 ? opportunities : generalOpportunities;

  return (
    <>
      {opps.length > 0 ? (
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0">
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
          <tbody className="text-center relative">
            {opps.map((opp, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                  opportunities.length > 0 ? "" : "blur"
                }`}
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
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${(() => {
                      const sum = opp.targetBuyer.department
                        .split("")
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      if (sum % 9 === 0) return "bg-blue-100 text-blue-800";
                      if (sum % 9 === 1) return "bg-purple-100 text-purple-800";
                      if (sum % 9 === 2) return "bg-orange-100 text-orange-800";
                      if (sum % 9 === 3) return "bg-teal-100 text-teal-800";
                      if (sum % 9 === 4) return "bg-pink-100 text-pink-800";
                      if (sum % 9 === 5) return "bg-indigo-100 text-indigo-800";
                      if (sum % 9 === 6) return "bg-yellow-100 text-yellow-800";
                      if (sum % 9 === 7) return "bg-green-100 text-green-800";
                      if (sum % 9 === 8) return "bg-red-100 text-red-800";
                      return "bg-gray-100 text-gray-800";
                    })()}`}
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
                      Prospect <IoBulb />
                    </button>

                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        companyName
                      )}+${encodeURIComponent(
                        opp.targetBuyer.role
                      )}+${encodeURIComponent(
                        opp.targetBuyer.department
                      )}+"LinkedIn"`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-white font-semibold justify-center border-indigo-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-indigo-500"
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
                <td colSpan={5}>
                  <div className="w-full h-full items-center flex justify-center absolute top-0 left-0">
                    <span className="text-4xl text-gray-600">No data</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead>
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
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="w-full p-10 text-gray-500 text-xl flex items-center justify-center">
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
