interface FinancialData {
  label: string;
  value: string | number;
  change: number;
}

const FinancialTable: React.FC = () => {
  const data: FinancialData[] = [
    { label: "Revenue", value: "90.75B", change: -4.31 },
    { label: "Operating expense", value: "14.37B", change: 5.22 },
    { label: "Net income", value: "23.64B", change: -2.17 },
    { label: "Net profit margin", value: 26.04, change: 2.2 },
    { label: "Earnings per share", value: 1.53, change: 0.66 },
    { label: "EBITDA", value: "30.74B", change: -1.54 },
  ];

  return (
    <div className="mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">(USD)</th>
            <th className="text-right p-2">MAR 2024</th>
            <th className="text-right p-2">Y/Y CHANGE</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
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
