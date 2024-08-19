interface NoDataSectionProps {
  content?: string;
}

const NoDataSection: React.FC<NoDataSectionProps> = ({ content }) => {
  return (
    <div className="flex items-center justify-center p-4 h-40">
      <span>{content ?? "There is no data"}</span>
    </div>
  );
};

export default NoDataSection;
