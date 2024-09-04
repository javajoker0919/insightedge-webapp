interface CompanyModuleSectionProps {
  etIDs: number[] | null;
}

const CompanyModuleSection: React.FC<CompanyModuleSectionProps> = ({
  etIDs,
}) => {
  if (etIDs == null) {
    return null;
  }

  return (
    <div className="h-[35rem] w-full">
      <span className="m-auto">Hello World</span>
    </div>
  );
};

export default CompanyModuleSection;
