import { FC } from "react";
import { FaLightbulb } from "react-icons/fa";

import { MarketingProps } from "@/app/components/interface";
import MarketingDetailsButton from "./MarketingDetailsButton";

interface MarketingTableProps {
  marketings: MarketingProps[];
}

const CompanyModuleMarketingTable: FC<MarketingTableProps> = ({
  marketings,
}) => {
  const getChannelClass = (channel: string): string => {
    const sum = channel
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
            Tactic
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-80">
            Target Personas
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-52">
            Channel
          </th>
          <th className="px-4 py-3 text-center font-medium border-x border-gray-200 w-32">
            Quick Actions
          </th>
        </tr>
      </thead>

      <tbody className="text-center relative">
        {marketings.map((marketing, index) => (
          <tr
            key={index}
            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
              marketings.length > 0 ? "" : "blur"
            }`}
          >
            <td className="px-4 py-3 border text-left border-gray-200">
              {marketing.tactic}
            </td>
            <td className="px-4 py-3 border border-gray-200 flex flex-wrap gap-1">
              {marketing.targetPersonas.map((persona, index) => {
                return (
                  <span className="rounded-full px-2 bg-gray-100 border border-gray-200 text-gray-900 text-sm">
                    {persona}
                  </span>
                );
              })}
            </td>
            <td className="px-4 py-3 border border-gray-200">
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getChannelClass(
                  marketing.channel
                )}`}
              >
                {marketing.channel}
              </span>
            </td>
            <td className="px-4 py-3 border border-gray-200">
              <div className="flex justify-center space-x-2">
                <MarketingDetailsButton marketing={marketing} />
              </div>
            </td>
          </tr>
        ))}
        {marketings.length === 0 && (
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

export default CompanyModuleMarketingTable;
