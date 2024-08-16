import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";

export interface YearQuarter {
  year: number;
  quarter: number;
  date: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: SelectOption[];
  value?: string;
  onChange: (selectedDate: string) => void;
}

interface YearQuarterSelectorProps {
  yearQuarters: YearQuarter[];
  setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedQuarter: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
}

const YearQuarterSelector: React.FC<YearQuarterSelectorProps> = ({
  yearQuarters,
  setSelectedYear,
  setSelectedQuarter,
  isLoading,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  useEffect(() => {
    if (yearQuarters.length > 0) {
      const firstYearQuarter = yearQuarters[0];
      setSelectedDate(firstYearQuarter.date);
      setSelectedYear(firstYearQuarter.year);
      setSelectedQuarter(firstYearQuarter.quarter);
    }
  }, [yearQuarters, setSelectedYear, setSelectedQuarter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (yearQuarters.length === 0) {
    return null;
  }

  const handleDropdownChange = (selectedDate: string) => {
    const selectedYearQuarter = yearQuarters.find(
      (yq) => yq.date === selectedDate
    );
    if (selectedYearQuarter) {
      setSelectedYear(selectedYearQuarter.year);
      setSelectedQuarter(selectedYearQuarter.quarter);
      setSelectedDate(selectedDate);
    }
  };

  return (
    <div className="flex space-x-4 items-center">
      <p className="shrink-0 pl-2 text-gray-600">As of earning date</p>
      <Dropdown
        value={selectedDate}
        options={yearQuarters.map((yq) => ({
          value: yq.date,
          label: format(new Date(yq.date), "MM/dd/yyyy"),
        }))}
        onChange={handleDropdownChange}
      />
    </div>
  );
};

export default YearQuarterSelector;

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedOption ? selectedOption.label : "Select an option"}
        </span>
        <svg
          className={`fill-current h-4 w-4 transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute overflow-hidden z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map(({ value, label }) => (
            <div
              key={value}
              className={`px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer ${
                value === selectedOption?.value ? "bg-gray-100" : ""
              }`}
              onClick={() => handleSelect(value)}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
