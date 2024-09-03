import { Loading } from "../..";

export interface FinancialData {
  label: string;
  value: string | number;
  change: number;
}

interface FinancialTableProps {
  currency: string;
  date: string;
  change: string;
  data: FinancialData[] | null;
}

const FinancialTable: React.FC<FinancialTableProps> = ({
  currency,
  date,
  change,
  data,
}) => {
  if (data === null) {
    return (
      <div className="w-full p-4 h-40 flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  if (data.length == 0) {
    return (
      <div className="w-full p-4 h-40 flex justify-center items-center">
        <span className="text-gray-500">There is no data</span>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-2">({currency})</th>
            <th className="text-right p-2">{date}</th>
            <th className="text-right p-2">{change}</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((item, index) => (
            <tr key={index} className="">
              <td className="p-2">{item.label}</td>
              <td className="text-right p-2">{item.value}</td>
              <td
                className={`text-right p-2 ${
                  item.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.change >= 0 ? "↑" : "↓"}
                {Math.abs(item.change).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;
