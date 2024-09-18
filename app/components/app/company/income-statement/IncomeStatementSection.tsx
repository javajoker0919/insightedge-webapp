import { useEffect, useState } from "react";

import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import { Details, LoadingSection, NoDataSection } from "@/app/components";
import FinancialTable, { FinancialDataProps } from "./FinancialTable";

interface CompanyIncomeStatementSectionProps {
  companyID: number;
}

const CompanyIncomeStatementSection: React.FC<
  CompanyIncomeStatementSectionProps
> = ({ companyID }) => {
  const { invokeToast } = useToastContext();

  const [fcData, setFCData] = useState<FinancialDataProps[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [currency, setCurrency] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [change, setChange] = useState<string>("");

  useEffect(() => {
    fetchIncomeStatements(companyID);
  }, [companyID]);

  const fetchIncomeStatements = async (companyID: number) => {
    setIsFetching(true);

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
        invokeToast(
          "error",
          `Failed to fetch income statements: ${error.message}`
        );
      } else if (data && data.length === 2) {
        const [current, previous] = data;

        setCurrency(current.reported_currency);
        setDate(current.date);
        setChange("QoQ change");

        const comparableData: FinancialDataProps[] = [
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
        setFCData(null);
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch income statement: ${error}`);
      console.error(`Failed to fetch income statement: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

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

  return (
    <Details title={"Income Statement"}>
      <div className="bg-white">
        {isFetching ? (
          <LoadingSection />
        ) : fcData == null ? (
          <NoDataSection />
        ) : (
          <FinancialTable
            currency={currency}
            date={date}
            change={change}
            data={fcData}
          />
        )}
      </div>
    </Details>
  );
};

export default CompanyIncomeStatementSection;
