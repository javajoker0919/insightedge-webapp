import FinancialTable from "./components/FinancialTable";
import QuarterlyChart from "./components/QuarterlyChart";

const IncomeStatementSection: React.FC = () => {
  return (
    <details
      className="bg-white border border-gray-300 rounded-lg overflow-hidden"
      open
    >
      <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
        Income Statement
      </summary>
      <div className="px-4 py-3 max-w-[600px] mx-auto">
        <QuarterlyChart />
      </div>
      <div className="px-4 py-3">
        <FinancialTable />
      </div>
    </details>
  );
};

export default IncomeStatementSection;
