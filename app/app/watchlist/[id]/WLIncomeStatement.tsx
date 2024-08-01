import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
// @ts-ignore
import numeral from "numeral";

import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import { CompanyDataType } from "./page";
import { useEffect, useState } from "react";
import moment from "moment";

interface WLIncomeStatementProps {
  watchlistCompanies: CompanyDataType[];
  isCompSortAlpha: boolean;
  onRemoveCompany: (id: number) => void;
}

interface IncomeStatementType extends CompanyDataType {
  symbol: string;
  revenue: number;
  revenue_yoy_growth: number;
  gross_profit: number;
  net_income_yoy_growth: number;
  operating_expenses: number;
  op_expense_yoy_growth: number;
  date: string;
}

const sortAlphabetically = (arr: IncomeStatementType[]) =>
  [...arr].sort((elA, elB) => {
    const nameA = elA.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const nameB = elB.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const numberPattern = /^\d+/;
    const numA = nameA.match(numberPattern);
    const numB = nameB.match(numberPattern);

    if (numA && numB) {
      const numComparison = parseInt(numA[0], 10) - parseInt(numB[0], 10);
      if (numComparison !== 0) return numComparison;
    }

    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  }) as IncomeStatementType[];

const randomColor = [
  "bg-fuchsia-800",
  "bg-teal-800",
  "bg-gray-800",
  "bg-red-800",
  "bg-blue-800",
  "bg-green-800",
  "bg-purple-800",
];

const WLIncomeStatement: React.FC<WLIncomeStatementProps> = ({
  watchlistCompanies,
  isCompSortAlpha,
  onRemoveCompany,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compIncStatement, setCompIncStatement] = useState<
    IncomeStatementType[] | null
  >(null);

  useEffect(() => {
    const fetchLatestWatchlistsData = async (companyIds: number[]) => {
      setIsLoading(true);
      const { data: incomeStatementData, error: incomeStatementError } =
        await supabase
          .from("income_statements")
          .select(
            `
            company_id,
            symbol,
            date,
            revenue,
            revenue_yoy_growth,
            gross_profit,
            net_income_yoy_growth,
            operating_expenses,
            op_expense_yoy_growth
          `
          )
          .in("company_id", companyIds)
          .order("date", { ascending: false });

      if (incomeStatementError) throw incomeStatementError;

      const updatedIncomeStatement = incomeStatementData.reduce<
        IncomeStatementType[]
      >((acc, curr) => {
        const existingData = acc.find((item) => item?.symbol === curr.symbol);

        if (
          !existingData ||
          moment(curr.date).isAfter(moment(existingData.date))
        ) {
          const updatedItem = {
            ...watchlistCompanies.find((e) => e.id === curr.company_id),
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
      fetchLatestWatchlistsData(watchlistCompanies.map((item) => item.id));
    }
  }, []);

  return (
    <div className="flex flex-col">
      <table>
        <thead>
          <tr>
            <th className="text-left w-[350px]"></th>
            <th className="text-left text-sm">
              Revenue <span className="text-xs">(YoY Change)</span>
            </th>
            <th className="text-left text-sm">
              Profit <span className="text-xs">(YoY Change)</span>
            </th>
            <th className="text-left text-sm">
              Expense <span className="text-xs">(YoY Change)</span>
            </th>
            <th className="text-left"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr key="loading" className="text-center">
              <td colSpan={5} className="py-4 text-sm">
                Loading...
              </td>
            </tr>
          )}
          {compIncStatement !== null &&
            (isCompSortAlpha
              ? sortAlphabetically(compIncStatement)
              : compIncStatement
            )?.map((company: IncomeStatementType, indx: number) => {
              const symbolClass = `${
                randomColor[indx % randomColor.length]
              } text-white text-xs p-1`;

              return (
                <tr
                  key={company.id}
                  onClick={() => router.push(`/app/company/${company.id}`)}
                  className="py-2 hover:cursor-pointer px-4 hover:bg-primary-50 border-t last:border-b-0 group"
                >
                  <td className="p-2">
                    <div className="flex gap-2 items-center">
                      <p className={symbolClass}>{company.symbol}</p>
                      <p className="font-medium text-sm">{company.name}</p>
                    </div>
                  </td>

                  <td title="Revenue/ Rev Growth" className="text-sm p-2">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 uppercase">
                      {numeral(company.revenue).format("$0.0a")}
                      {Number(company.revenue_yoy_growth) > 0 ? (
                        <MdArrowUpward className="text-green-700" />
                      ) : (
                        <MdArrowDownward className="text-red-700" />
                      )}
                      <p
                        className={`text-xs ${
                          Number(company.revenue_yoy_growth) > 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        ({numeral(company.revenue_yoy_growth).format("0.00")}%)
                      </p>
                    </div>
                  </td>
                  <td title="Income/ Inc Growth" className="text-sm p-2">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 uppercase">
                      {numeral(company.gross_profit).format("$0.0a")}
                      {Number(company.net_income_yoy_growth) > 0 ? (
                        <MdArrowUpward className="text-green-700" />
                      ) : (
                        <MdArrowDownward className="text-red-700" />
                      )}

                      <p
                        className={`text-xs ${
                          Number(company.net_income_yoy_growth) > 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        ({numeral(company.net_income_yoy_growth).format("0.00")}
                        %)
                      </p>
                    </div>
                  </td>
                  <td title="Expense/ Exp Growth" className="text-sm p-2">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 uppercase">
                      {numeral(company.operating_expenses).format("$0.0a")}
                      {Number(company.op_expense_yoy_growth) > 0 ? (
                        <MdArrowUpward className="text-green-700" />
                      ) : (
                        <MdArrowDownward className="text-red-700" />
                      )}
                      <p
                        className={`text-xs ${
                          Number(company.op_expense_yoy_growth) > 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        ({numeral(company.op_expense_yoy_growth).format("0.00")}
                        %)
                      </p>
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
                      <IoClose className="text-lg" />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default WLIncomeStatement;