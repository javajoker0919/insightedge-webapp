"use client";

import { useRouter } from "next/navigation";
import numeral from "numeral";

import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import { Loading } from "..";
import { getMixPanelClient } from "@/utils/mixpanel";

export interface IncomeStatementProps {
  companyID: number;
  companySymbol: string;
  companyName: string;
  revenue: number;
  revenueYoyGrowth: number;
  netIncome: number;
  netIncomeYoyGrowth: number;
  fillingDate: string;
  period: string;
}

interface WLIncomeStatementProps {
  incomeStatements: IncomeStatementProps[];
  handleRemoveCompanyFromWatchlist: (companyID: number) => void;
  isSorted: boolean;
  isLoading: boolean;
}

const randomColor = [
  "bg-fuchsia-800",
  "bg-teal-800",
  "bg-gray-800",
  "bg-red-800",
  "bg-blue-800",
  "bg-green-800",
  "bg-purple-800",
];

const WLIncomeStatementSection: React.FC<WLIncomeStatementProps> = ({
  incomeStatements,
  handleRemoveCompanyFromWatchlist,
  isSorted,
  isLoading,
}) => {
  const router = useRouter();
  const mixpanel = getMixPanelClient();

  const sortStatements = (
    statements: IncomeStatementProps[],
    isSorted: boolean
  ) => {
    return statements
      ?.slice()
      .sort((a, b) =>
        isSorted
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName)
      );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center bg-yellow-50 rounded p-2 border border-yellow-200">
        <p className="text-gray-700 font-medium text-xs sm:text-sm text-center">
          This is the latest quarterly earnings
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left w-[150px] sm:w-[300px] p-2 text-xs sm:text-sm">
                Company
              </th>
              <th className="text-left p-2 text-xs sm:text-sm">As Of</th>
              <th className="text-left p-2 text-xs sm:text-sm">
                Revenue <span className="text-xxs sm:text-xs">(QoQ)</span>
              </th>
              <th className="text-left p-2 text-xs sm:text-sm">
                Net Income <span className="text-xxs sm:text-xs">(QoQ)</span>
              </th>
              <th className="text-left p-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="text-left">
            {isLoading && (
              <tr key="loading" className="text-center">
                <td colSpan={5} className="py-4 text-xs sm:text-sm">
                  <Loading />
                </td>
              </tr>
            )}
            {incomeStatements !== null &&
              sortStatements(incomeStatements, isSorted).map(
                (incomeStatement: IncomeStatementProps, indx: number) => {
                  const symbolClass = `${
                    randomColor[indx % randomColor.length]
                  } text-white text-xxs sm:text-xs p-1`;

                  return (
                    <tr
                      key={incomeStatement.companyID}
                      onClick={() =>
                        router.push(`/app/company/${incomeStatement.companyID}`)
                      }
                      className="py-2 hover:cursor-pointer px-2 sm:px-4 hover:bg-gray-50 border-t last:border-b-0 group"
                    >
                      <td className="p-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <p className={symbolClass}>
                            {incomeStatement.companySymbol}
                          </p>
                          <p className="font-medium text-xs sm:text-sm truncate">
                            {incomeStatement.companyName}
                          </p>
                        </div>
                      </td>

                      <td
                        title={incomeStatement.period}
                        className="text-xs sm:text-sm p-2"
                      >
                        {incomeStatement.fillingDate}
                      </td>

                      <td
                        title="Revenue/ Rev Growth"
                        className="text-xs sm:text-sm p-2"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 uppercase">
                          {numeral(incomeStatement.revenue).format("$0.0a")}
                          <div className="flex items-center">
                            {Number(incomeStatement.revenueYoyGrowth) > 0 ? (
                              <MdArrowUpward className="text-green-700 text-xs sm:text-sm" />
                            ) : (
                              <MdArrowDownward className="text-red-700 text-xs sm:text-sm" />
                            )}
                            <p
                              className={`text-xxs sm:text-xs ${
                                Number(incomeStatement.revenueYoyGrowth) > 0
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              (
                              {numeral(incomeStatement.revenueYoyGrowth).format(
                                "0.00"
                              )}
                              %)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        title="Income/ Inc Growth"
                        className="text-xs sm:text-sm p-2"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 uppercase">
                          {numeral(incomeStatement.netIncome).format("$0.0a")}
                          <div className="flex items-center">
                            {Number(incomeStatement.netIncomeYoyGrowth) > 0 ? (
                              <MdArrowUpward className="text-green-700 text-xs sm:text-sm" />
                            ) : (
                              <MdArrowDownward className="text-red-700 text-xs sm:text-sm" />
                            )}
                            <p
                              className={`text-xxs sm:text-xs ${
                                Number(incomeStatement.netIncomeYoyGrowth) > 0
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              (
                              {numeral(
                                incomeStatement.netIncomeYoyGrowth
                              ).format("0.00")}
                              %)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            mixpanel.track("company.remove", {
                              $source: "watchlist_page.income_statements",
                            });

                            handleRemoveCompanyFromWatchlist(
                              incomeStatement.companyID
                            );
                          }}
                          className="text-white hover:bg-gray-200 p-2 rounded-full group-hover:text-gray-500"
                        >
                          <IoClose className="text-base sm:text-lg" />
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WLIncomeStatementSection;
