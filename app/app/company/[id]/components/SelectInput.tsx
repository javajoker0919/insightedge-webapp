interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  defaultValue: number | undefined;
  options: SelectOption[];
  value: number | undefined;
  onChange: (selectedYear: number) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  defaultValue,
  options,
  value,
  onChange,
}) => (
  <select
    defaultValue={defaultValue}
    value={value}
    onChange={(e) => onChange(parseInt(e.target.value))}
    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none cursor-pointer"
  >
    {options.map(({ value, label }) => (
      <option key={value} value={value} className="text-gray-700">
        {label}
      </option>
    ))}
  </select>
);

export default SelectInput;
