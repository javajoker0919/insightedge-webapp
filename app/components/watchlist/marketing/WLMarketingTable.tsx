"use client";
import { useCallback } from "react";
import { FaLightbulb } from "react-icons/fa";
import { marketingStrategy } from "@/app/app/company/[id]/Constants";
import { MarketingProps } from "./WLMarketingSection";

interface MSTableCompProps {
  strategies: MarketingProps[];
  onQuickAction: (opp: MarketingProps) => void;
}

const getTextClass = (text: string) => {
  const sum = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
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

const MarketingStrategyTable: React.FC<MSTableCompProps> = ({
  strategies,
  onQuickAction,
}) => {
  const marketings = strategies.length > 0 ? strategies : marketingStrategy;

  const TableHeadingRow = useCallback(
    () => (
      <tr className="bg-gray-100 text-black">
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-32">
          Company Name
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300">
          Tactic
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-48 2xl:w-96">
          Target Personas
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-32 2xl:w-64">
          Channel
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-32">
          Quick Actions
        </th>
      </tr>
    ),
    []
  );

  return (
    <>
      {marketings.length > 0 ? (
        <div className="w-full lg:w-[600px] xl:w-full">
          <table className="relative border-collapse min-w-[1200px] xl:min-w-[600px] w-full overflow-x-auto">
            <thead className="sticky z-10 top-0">
              <TableHeadingRow />
            </thead>
            <tbody className="text-center relative">
              {marketings.map((marketing, index) => {
                return (
                  <tr
                    key={`market-strategy-${index}`}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${strategies.length > 0 ? "" : "blur"}`}
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border border-gray-300 text-xs 2xl:text-sm">
                      {marketing.companyName}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border border-gray-300 text-xs 2xl:text-sm">
                      {marketing.tactic}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border justify-items-center gap-2 border-gray-300 text-xs 2xl:text-sm">
                      {marketing.targetPersonas.split("\n").join(", ")}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border border-gray-300">
                      <span
                        className={`inline-block min-w-7 px-1 sm:px-2 py-1 m-[2px] rounded-2xl border text-xs 2xl:text-sm font-medium ${getTextClass(
                          marketing.channel
                        )}`}
                      >
                        {marketing.channel}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 border border-gray-300">
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => onQuickAction(marketing)}
                          className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500 text-xs 2xl:text-sm"
                        >
                          Details <FaLightbulb />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {strategies.length === 0 && (
                <tr>
                  <td colSpan={5}>
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
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <TableHeadingRow />
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}>
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

export default MarketingStrategyTable;
