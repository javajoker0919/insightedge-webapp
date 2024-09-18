import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";

import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import { LoadingSection } from "../..";

interface CompanyDateSelectorProps {
  companyID: number;
  setETID: React.Dispatch<React.SetStateAction<number | null>>;
}

interface SelectOption {
  value: number;
  label: string;
}

interface DropdownProps {
  value: number | null;
  onChange: (selectedDate: number) => void;
  options: SelectOption[];
}

interface ETDateProps {
  id: number;
  date: string;
}

const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleSelect = (selectedValue: number) => {
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

const CompanyDateSelector: React.FC<CompanyDateSelectorProps> = ({
  companyID,
  setETID,
}) => {
  const { invokeToast } = useToastContext();

  const [selectedETID, setSelectedETID] = useState<number | null>(null);
  const [etDates, setETDates] = useState<ETDateProps[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    fetchETDates(companyID);
  }, [companyID]);

  const fetchETDates = async (companyID: number) => {
    setIsFetching(true);

    try {
      const { data, error } = await supabase
        .from("earnings_transcripts")
        .select(`id, date`)
        .eq("company_id", companyID)
        .order("date", { ascending: false });

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch earnigs transcript data: ${error.message}`
        );
      } else if (data && data.length > 0) {
        setETDates(data as ETDateProps[]);
        setSelectedETID(data[0].id);
        setETID(data[0].id);
      } else {
        setETDates(null);
        setSelectedETID(null);
        setETID(null);
      }
    } catch (error) {
      invokeToast(
        "error",
        `Failed to fetch earnings transcript data: ${error}`
      );
      console.error(`Failed to fetch earnings transcript data: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDropdownChange = (selectedETID: number) => {
    setSelectedETID(selectedETID);
    setETID(selectedETID);
  };

  if (isFetching) {
    return <LoadingSection />;
  } else if (etDates == null) {
    return null;
  } else {
    return (
      <div className="flex space-x-4 items-center">
        <p className="shrink-0 pl-2 text-gray-600">As of earning date</p>

        <Dropdown
          value={selectedETID}
          onChange={handleDropdownChange}
          options={etDates.map((etDate) => {
            return {
              value: etDate.id,
              label: format(new Date(etDate.date), "MM/dd/yyyy"),
            };
          })}
        />
      </div>
    );
  }
};

export default CompanyDateSelector;
