import { useCallback } from "react";
import { FaLightbulb } from "react-icons/fa";
import { coloredChannelList, marketingStrategy } from "../Constants";
import { MarketingProps } from "./MarketingStrategySection";

interface MSTableCompProps {
  companyName: string;
  strategies: MarketingProps[];
  onQuickAction: (opp: MarketingProps) => void;
}

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
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 ">
          Audience
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 w-2/12">
          Channels
        </th>
        <th className="px-4 py-3 text-center font-medium border-x border-gray-300 ">
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
            {strats.map((strgy, index) => {
              const audience = strgy.relevantAudience.split(", ");
              return (
                <tr
                  key={`market-strategy-${index}`}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                    strategies.length > 0 ? "" : "blur"
                  }`}
                >
                  <td className="px-4 py-3 border text-left border-gray-300">
                    {strgy.marketingTactic}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        strgy.tacticScore >= 90
                          ? "bg-green-100 text-green-800"
                          : strgy.tacticScore >= 70
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {strgy.tacticScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-gray-300 text-left ">
                    {audience.map((aud, indx) => (
                      <span
                        key={`audience-${indx}-${aud}`}
                        className={`text-xs font-medium`}
                      >
                        {aud + (audience?.length - 1 !== indx ? ", " : "")}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {strgy.channels.map((chnl, indx) => {
                      const coloredChnl = coloredChannelList.find((el) =>
                        el.content.includes(chnl)
                      );
                      const foundColor =
                        coloredChnl?.color?.toLowerCase() || `#004AAD`;

                      return (
                        <span
                          key={`channel-${indx}-${chnl}`}
                          style={{
                            backgroundColor: `${foundColor}4d`,
                          }}
                          className={
                            "inline-block min-w-7 px-2 py-1 m-[2px] rounded-full text-xs font-medium"
                          }
                        >
                          {chnl}
                        </span>
                      );
                    })}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onQuickAction(strgy)}
                        className="text-primary-500 hover:text-white font-semibold justify-center border-primary-500 border flex items-center gap-1 rounded-full !min-w-fit p-1 px-2 hover:bg-primary-500"
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
