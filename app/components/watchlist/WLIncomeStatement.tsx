import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import numeral from "numeral";

import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import { CompanyDataType } from "../../app/watchlist/[id]/page";
import { useEffect, useState } from "react";
import moment from "moment";

interface WLIncomeStatementProps {
  watchlistCompanies: CompanyDataType[];
  isSorted: boolean;
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
    const fetchLatestWatchlistsData = async (companyIds: string[]) => {
      setIsLoading(true);
      const { data: incomeStatementData, error: incomeStatementError } =
        await supabase
          .from("income_statements")
          .select(
            `
            company_id,
            symbol,
            date,
            period,
            revenue,
            revenue_yoy_growth,
            gross_profit,
            net_income_yoy_growth,
            operating_expenses,
            op_expense_yoy_growth
          `
          )
          .in("symbol", companyIds)
          .neq("period", "FY")
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
    <div className="flex flex-col">
      <table>
        <thead>
          <tr>
            <th className="text-left w-[300px]"></th>
            <th className="text-sm">As Of</th>
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
            sortStatements(compIncStatement, isSorted).map(
              (company: IncomeStatementType, indx: number) => {
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

                    <td title={company.period} className="text-xs p-2">
                      {company.date}
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
                          ({numeral(company.revenue_yoy_growth).format("0.00")}
                          %)
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
                          (
                          {numeral(company.net_income_yoy_growth).format(
                            "0.00"
                          )}
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
                          (
                          {numeral(company.op_expense_yoy_growth).format(
                            "0.00"
                          )}
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
              }
            )}
        </tbody>
      </table>
    </div>
  );
};

export default WLIncomeStatementSection;
