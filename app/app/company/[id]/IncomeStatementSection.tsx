import { Details } from "./components";
import FinancialTable from "./components/FinancialTable";
import QuarterlyChart from "./components/QuarterlyChart";

const IncomeStatementSection: React.FC = () => {
  return (
    <Details title={"Income Statement"}>
      <div className="px-4 py-3 max-w-[600px] mx-auto">
        <QuarterlyChart />
      </div>
      <div className="px-4 py-3">
        <FinancialTable />
      </div>
    </Details>
  );
};

export default IncomeStatementSection;
