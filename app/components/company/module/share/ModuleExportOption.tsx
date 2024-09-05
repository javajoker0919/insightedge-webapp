const ModuleExportOption: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center space-x-3"
    >
      <div className="text-gray-400">{icon}</div>
      <div>
        <span className="font-medium text-gray-800">{title}</span>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
};

export default ModuleExportOption;
