import { FaLightbulb } from "react-icons/fa";
import { marketingStrategy } from "../Constants";
import { MarketingProps } from "./MarketingSection";
import { useCallback, useMemo } from "react";

interface MSTableCompProps {
  companyName: string;
  strategies: MarketingProps[];
  onQuickAction: (opp: MarketingProps) => void;
}

const PILL_COLORS = [
  "bg-blue-100 text-blue-800 border border-1 border-white hover:border-blue-400",
  "bg-purple-100 text-purple-800 border border-1 border-white hover:border-purple-400",
  "bg-orange-100 text-orange-800 border border-1 border-white hover:border-orange-400",
  "bg-teal-100 text-teal-800 border border-1 border-white hover:border-teal-400",
  "bg-pink-100 text-pink-800 border border-1 border-white hover:border-pink-400",
  "bg-primary-100 text-primary-800 border border-1 border-white hover:border-primary-400",
  "bg-yellow-100 text-yellow-800 border border-1 border-white hover:border-yellow-400",
  "bg-green-100 text-green-800 border border-1 border-white hover:border-green-400",
  "bg-red-100 text-red-800 border border-1 border-white hover:border-red-400",
  "bg-gray-100 text-gray-800 border border-1 border-white hover:border-gray-400",
];

const MarketingStrategyTable: React.FC<MSTableCompProps> = ({
  companyName,
  strategies,
  onQuickAction,
}) => {
  const strats = strategies.length > 0 ? strategies : marketingStrategy;

  const TableHeadingRow = useCallback(
    () => (
      <tr className="bg-gray-200 text-black">
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-4/12">
          Marketing Tactic
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-10">
          Score
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-5/12">
          Audience
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-2/12">
          Channels
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-1/5">
          Quick Actions
        </th>
      </tr>
    ),
    []
  );

  return (
    <>
      {strats.length > 0 ? (
        <table className="w-full relative border-collapse">
          <thead className="sticky z-10 top-0">
            <TableHeadingRow />
          </thead>
          <tbody className="text-center relative">
            {strats.map((strt, index) => (
              <tr
                key={`market-strategy-${index}`}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                  strategies.length > 0 ? "" : "blur"
                }`}
              >
                <td className="px-4 py-3 border text-left border-gray-300">
                  {strt.marketingTactic}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                      strt.tacticScore >= 90
                        ? "bg-green-100 text-green-800"
                        : strt.tacticScore >= 70
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {strt.tacticScore}
                  </span>
                </td>
                <td className="px-4 py-3 border border-gray-300 ">
                  {strt.relevantAudience.split(", ").map((aud, indx) => (
                    <span
                      className={`inline-block min-w-7 px-2 py-1 rounded-full text-xs font-medium ${(() =>
                        PILL_COLORS[indx % PILL_COLORS.length])()}`}
                    >
                      {aud}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  {strt.channels.map((ch) => (
                    <span
                      className={`inline-block min-w-7 px-2 py-1 rounded-full text-xs font-medium ${(() => {
                        return PILL_COLORS[index % PILL_COLORS.length];
                      })()}`}
                    >
                      {ch}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 border border-gray-300">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onQuickAction(strt)}
                      className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
                    >
                      Addional Details <FaLightbulb />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {strategies.length === 0 && (
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
              <TableHeadingRow />
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

export default MarketingStrategyTable;
