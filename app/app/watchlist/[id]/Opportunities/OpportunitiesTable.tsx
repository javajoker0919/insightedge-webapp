import { IoBulb, IoPerson } from "react-icons/io5";
import { OpportunityProps } from "./OpportunitiesSection";

const colorClasses = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-teal-100 text-teal-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-yellow-100 text-yellow-800",
  "bg-green-100 text-green-800",
  "bg-red-100 text-red-800",
];

const OpportunitiesTable: React.FC<{
  companyName: string;
  opportunities: OpportunityProps[];
  onQuickAction: (opp: OpportunityProps) => void;
}> = ({ companyName, opportunities, onQuickAction }) => {
  const TableHeadRow = () => (
    <tr className="bg-gray-200 text-black">
      <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
        Opportunity
      </th>
      <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-24">
        Company
      </th>
      <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-10">
        Score
      </th>
      <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-1/6">
        Target Buyer Role
      </th>
      <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-36">
        Target Buyer Department
      </th>
      <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-28">
        Quick Actions
      </th>
    </tr>
  );

  return (
    <>
      {opportunities?.length > 0 ? (
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0">
            <TableHeadRow />
          </thead>
          <tbody className="text-center relative">
            {opportunities.map((opp, index) => (
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
                      for (let i = 0; i <= 9; i++)
                        if (sum % 9 === i) return colorClasses[i];
                      return "bg-gray-100 text-gray-800";
                    })()}`}
                  >
                    {opp.targetBuyer.department}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <div className="flex flex-col justify-center gap-1">
                    <button
                      onClick={() => onQuickAction(opp)}
                      className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
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
                      className="whitespace-nowrap text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
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
              <TableHeadRow />
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
