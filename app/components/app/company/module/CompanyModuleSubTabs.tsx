interface CompanyModuleSubTabsProps {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<"general" | "tailored">>;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-16 py-2 w-full sm:w-auto ${
        isActive
          ? "text-gray-900 bg-white border-gray-300"
          : "text-gray-500 bg-gray-100 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
};

const CompanyModuleSubTabs: React.FC<CompanyModuleSubTabsProps> = ({
  active,
  setActive,
}) => {
  return (
    <div className="w-full border-b pb-0 flex items-center justify-between">
      <div className="flex border border-b-0">
        <TabButton
          label="General"
          isActive={active === "general"}
          onClick={() => setActive("general")}
        />
        <TabButton
          label="Tailored"
          isActive={active === "tailored"}
          onClick={() => setActive("tailored")}
        />
      </div>
    </div>
  );
};

export default CompanyModuleSubTabs;
