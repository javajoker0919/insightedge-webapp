import { useEffect, useState } from "react";

import { Details } from "../..";
import FinancialTable, { FinancialData } from "./FinancialTable";
import QuarterlyChart from "./QuarterlyChart";
import { supabase } from "@/utils/supabaseClient";

interface IncomeStatementSectionProps {
  companyID: number;
}

const IncomeStatementSection: React.FC<IncomeStatementSectionProps> = ({
  companyID,
}) => {
  const [currency, setCurrency] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [change, setChange] = useState<string>("");
  const [fcData, setFCData] = useState<FinancialData[] | null>(null);

  useEffect(() => {
    fetchIncomeStatements(companyID);
  }, [companyID]);

  const fetchIncomeStatements = async (companyID: number) => {
    if (!companyID) return;

    try {
      const { data, error } = await supabase
        .from("income_statements")
        .select(
          `
            reported_currency, 
            date, 
            revenue, 
            revenue_yoy_growth, 
            operating_income, 
            operating_income_ratio, 
            net_income, 
            net_income_yoy_growth, 
            eps, 
            eps_diluted,
            gross_profit,
            gross_profit_ratio
          `
        )
        .eq("company_id", companyID)
        .order("date", { ascending: false })
        .limit(2);

      if (error) {
        console.error(
          "Error occurred while fetching income statements: ",
          error
        );
        throw error;
      }

      if (data.length === 2) {
        const [current, previous] = data;

        setCurrency(current.reported_currency);
        setDate(current.date);
        setChange("QoQ change");

        const formatLargeValue = (value: number) =>
          value >= 1e9
            ? `${(value / 1e9).toFixed(2)}B`
            : value >= 1e6
            ? `${(value / 1e6).toFixed(2)}M`
            : value.toLocaleString("en-US");

        const parseNumber = (value: any) => {
          const parsedValue = parseFloat(value);
          return isNaN(parsedValue) ? 0 : parsedValue;
        };

        const comparableData: FinancialData[] = [
          {
            label: "Revenue",
            value: formatLargeValue(parseNumber(current.revenue)),
            change:
              ((parseNumber(current.revenue) - parseNumber(previous.revenue)) /
                parseNumber(previous.revenue)) *
              100,
          },
          {
            label: "Operating Income",
            value: formatLargeValue(parseNumber(current.operating_income)),
            change:
              ((parseNumber(current.operating_income) -
                parseNumber(previous.operating_income)) /
                parseNumber(previous.operating_income)) *
              100,
          },
          {
            label: "Net Income",
            value: formatLargeValue(parseNumber(current.net_income)),
            change:
              ((parseNumber(current.net_income) -
                parseNumber(previous.net_income)) /
                parseNumber(previous.net_income)) *
              100,
          },
          {
            label: "EPS",
            value: parseNumber(current.eps).toFixed(2),
            change:
              ((parseNumber(current.eps) - parseNumber(previous.eps)) /
                parseNumber(previous.eps)) *
              100,
          },
          {
            label: "Gross Profit",
            value: formatLargeValue(parseNumber(current.gross_profit)),
            change:
              ((parseNumber(current.gross_profit) -
                parseNumber(previous.gross_profit)) /
                parseNumber(previous.gross_profit)) *
              100,
          },
        ];
        setFCData(comparableData);
      } else {
        setFCData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Details title={"Income Statement"}>
      <div className="bg-white">
        <FinancialTable
          currency={currency}
          date={date}
          change={change}
          data={fcData}
        />
      </div>
    </Details>
  );
};

export default IncomeStatementSection;
