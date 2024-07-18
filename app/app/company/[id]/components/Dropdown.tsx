import { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface DropdownProps {
  defaultValue: number | undefined;
  options: SelectOption[];
  value: number | undefined;
  onChange: (selectedYear: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  defaultValue,
  options,
  value,
  onChange,
}) => {
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
    onChange(parseInt(selectedValue));
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === value?.toString()
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out cursor-pointer flex justify-between items-center"
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
        <div className="absolute overflow-hidden z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map(({ value, label }) => (
            <div
              key={value}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
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

export default Dropdown;
