import { FC } from "react";
import { IoPerson } from "react-icons/io5";

import { OpportunityProps } from "@/app/components/interface";
import OpportunityProspectButton from "./OpportunityProspectButton";

interface OpportunityTableProps {
  opportunities: OpportunityProps[];
}

const OpportunityTable: FC<OpportunityTableProps> = ({ opportunities }) => {
  const getFindBuyerLink = (opportunity: OpportunityProps) => {
    return `https://www.google.com/search?q=${encodeURIComponent(
      opportunity.companyName
    )}+${encodeURIComponent(opportunity.targetBuyer.role)}+${encodeURIComponent(
      opportunity.targetBuyer.department
    )}+"LinkedIn"`;
  };

  const getDepartmentClass = (department: string): string => {
    const sum = department
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    switch (sum % 9) {
      case 0:
        return "bg-blue-100 text-blue-800";
      case 1:
        return "bg-purple-100 text-purple-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-teal-100 text-teal-800";
      case 4:
        return "bg-pink-100 text-pink-800";
      case 5:
        return "bg-indigo-100 text-indigo-800";
      case 6:
        return "bg-yellow-100 text-yellow-800";
      case 7:
        return "bg-green-100 text-green-800";
      case 8:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <table className="w-full relative border-collapse min-w-[1200px]">
      <thead className="sticky z-10 top-0">
        <tr className="bg-gray-100 text-black">
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200">
            Opportunity
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-1/6">
            Target Buyer Role
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-52">
            Target Buyer Department
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-64">
            Quick Actions
          </th>
        </tr>
      </thead>

      <tbody className="text-center relative">
        {opportunities.map((opportunity, index) => (
          <tr
            key={index}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
              opportunities.length > 0 ? "" : "blur"
            }`}
          >
            <td className="px-4 py-3 border text-left border-gray-200">
              {opportunity.name}
            </td>
            <td className="px-4 py-3 border border-gray-200">
              {opportunity.targetBuyer.role}
            </td>
            <td className="px-4 py-3 border border-gray-200">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getDepartmentClass(
                  opportunity.targetBuyer.department
                )}`}
              >
                {opportunity.targetBuyer.department}
              </span>
            </td>
            <td className="px-4 py-3 border border-gray-200">
              <div className="flex justify-center space-x-2">
                <OpportunityProspectButton opportunity={opportunity} />

                <a
                  href={getFindBuyerLink(opportunity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
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
            <td colSpan={4}>
              <div className="w-full h-full items-center flex justify-center absolute top-0 left-0">
                <span className="text-4xl text-gray-600">No data</span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OpportunityTable;
