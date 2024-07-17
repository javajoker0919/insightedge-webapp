import { useState, useEffect } from "react";
import SelectInput from "./components/SelectInput";

export interface YearQuarter {
  year: number;
  quarter: number;
}

const YearQuarterSelector: React.FC<{
  yearQuarters: YearQuarter[];
  setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedQuarter: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
}> = ({ yearQuarters, setSelectedYear, setSelectedQuarter, isLoading }) => {
  const [year, setYear] = useState<number>();
  const [quarter, setQuarter] = useState<number>();

  useEffect(() => {
    if (yearQuarters.length > 0) {
      const latestYear = yearQuarters[yearQuarters.length - 1].year;
      const latestQuarter = yearQuarters[yearQuarters.length - 1].quarter;
      setYear(latestYear);
      setSelectedYear(latestYear);
      setSelectedQuarter(latestQuarter);
    }
  }, [yearQuarters, setSelectedYear, setSelectedQuarter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (yearQuarters.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-4">
      <SelectInput
        defaultValue={year || undefined}
        value={year}
        options={yearQuarters
          .map((yq) => yq.year)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map((year) => ({
            value: year.toString(),
            label: year.toString(),
          }))}
        onChange={(selectedYear: number) => {
          setSelectedYear(selectedYear);
          setSelectedQuarter(1);
          setYear(selectedYear);
          setQuarter(1);
        }}
      />
      {year && (
        <SelectInput
          defaultValue={yearQuarters.find((yq) => yq.year === year)?.quarter}
          value={quarter}
          options={yearQuarters
            .filter((yq) => yq.year === year)
            .map((yq) => yq.quarter)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((quarter) => ({
              value: quarter.toString(),
              label: `Q${quarter}`,
            }))}
          onChange={(selectedQuarter: number) => {
            setSelectedQuarter(selectedQuarter);
            setQuarter(selectedQuarter);
          }}
        />
      )}
    </div>
  );
};

export default YearQuarterSelector;
