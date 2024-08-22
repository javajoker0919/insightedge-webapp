"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import numeral from "numeral";

import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import { CompanyDataType } from "../../app/watchlist/[id]/page";
import { useEffect, useState } from "react";
import moment from "moment";
import Loading from "../Loading";

interface WLIncomeStatementProps {
  watchlistCompanies: CompanyDataType[];
  isSorted: boolean;
  onRemoveCompany: (id: number) => void;
}

interface IncomeStatementType extends CompanyDataType {
  symbol: string;
  revenue: number;
  revenue_yoy_growth: number;
  net_income: number;
  net_income_yoy_growth: number;
  filling_date: string;
  period: string;
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
  watchlistCompanies,
  isSorted,
  onRemoveCompany,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compIncStatement, setCompIncStatement] = useState<
    IncomeStatementType[] | null
  >(null);

  useEffect(() => {
    const fetchLatestWatchlistsData = async (companySymbols: string[]) => {
      setIsLoading(true);

      const { data: incomeStatementData, error: incomeStatementError } =
        await supabase
          .from("income_statements")
          .select(
            `
            company_id,
            symbol,
            filling_date,
            period,
            revenue,
            revenue_yoy_growth,
            net_income,
            net_income_yoy_growth
          `
          )
          .in("symbol", companySymbols)
          .neq("period", "FY")
          .order("filling_date", { ascending: false });

      if (incomeStatementError) throw incomeStatementError;

      const updatedIncomeStatement = incomeStatementData.reduce<
        IncomeStatementType[]
      >((acc, curr) => {
        const existingData = acc.find((item) => item?.symbol === curr.symbol);

        if (
          !existingData ||
          moment(curr.filling_date).isAfter(moment(existingData.filling_date))
        ) {
          const updatedItem = {
            ...watchlistCompanies.find((e) => e.symbol === curr.symbol),
            ...curr,
          } as IncomeStatementType;

          const index = acc.findIndex((item) => item?.symbol === curr.symbol);

          if (index !== -1) {
            acc[index] = updatedItem;
          } else {
            acc.push(updatedItem);
          }
        }

        return acc;
      }, []);

      setCompIncStatement(updatedIncomeStatement);
      setIsLoading(false);
    };

    if (watchlistCompanies.length) {
      fetchLatestWatchlistsData(watchlistCompanies.map((item) => item.symbol));
    }
  }, [watchlistCompanies]);

  const sortStatements = (
    statements: IncomeStatementType[],
    isSorted: boolean
  ) => {
    return statements
      ?.slice()
      .sort((a, b) =>
        isSorted ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
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
              <th className="text-left p-2"></th>
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
            {compIncStatement !== null &&
              sortStatements(compIncStatement, isSorted).map(
                (company: IncomeStatementType, indx: number) => {
                  const symbolClass = `${
                    randomColor[indx % randomColor.length]
                  } text-white text-xxs sm:text-xs p-1`;

                  return (
                    <tr
                      key={company.id}
                      onClick={() => router.push(`/app/company/${company.id}`)}
                      className="py-2 hover:cursor-pointer px-2 sm:px-4 hover:bg-primary-50 border-t last:border-b-0 group"
                    >
                      <td className="p-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <p className={symbolClass}>{company.symbol}</p>
                          <p className="font-medium text-xs sm:text-sm truncate">
                            {company.name}
                          </p>
                        </div>
                      </td>

                      <td
                        title={company.period}
                        className="text-xs sm:text-sm p-2"
                      >
                        {company.filling_date}
                      </td>

                      <td
                        title="Revenue/ Rev Growth"
                        className="text-xs sm:text-sm p-2"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 uppercase">
                          {numeral(company.revenue).format("$0.0a")}
                          <div className="flex items-center">
                            {Number(company.revenue_yoy_growth) > 0 ? (
                              <MdArrowUpward className="text-green-700 text-xs sm:text-sm" />
                            ) : (
                              <MdArrowDownward className="text-red-700 text-xs sm:text-sm" />
                            )}
                            <p
                              className={`text-xxs sm:text-xs ${
                                Number(company.revenue_yoy_growth) > 0
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              (
                              {numeral(company.revenue_yoy_growth).format(
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
                          {numeral(company.net_income).format("$0.0a")}
                          <div className="flex items-center">
                            {Number(company.net_income_yoy_growth) > 0 ? (
                              <MdArrowUpward className="text-green-700 text-xs sm:text-sm" />
                            ) : (
                              <MdArrowDownward className="text-red-700 text-xs sm:text-sm" />
                            )}
                            <p
                              className={`text-xxs sm:text-xs ${
                                Number(company.net_income_yoy_growth) > 0
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              (
                              {numeral(company.net_income_yoy_growth).format(
                                "0.00"
                              )}
                              %)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            onRemoveCompany(company.watchlist_company_id);
                            e.stopPropagation();
                          }}
                          className="text-white hover:bg-gray-200 p-0.5 rounded-full group-hover:text-gray-500"
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
