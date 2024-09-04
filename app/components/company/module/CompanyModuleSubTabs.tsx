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
      className={`px-8 py-2 w-full sm:w-auto ${
        isActive ? "text-gray-900 bg-gray-50" : "text-gray-700"
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
    <div className="w-full border-b border-gray-300 p-1 pb-0 flex items-center bg-gray-200 justify-between">
      <div className="flex gap-1">
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
