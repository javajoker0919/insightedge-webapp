interface SummaryItemProps {
  title: string;
  content: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, content }) => (
  <details
    className="mb-2 bg-gray-50 overflow-hidden rounded border border-gray-200"
    open
  >
    <summary className="px-3 py-2 cursor-pointer text-base text-gray-600 hover:bg-gray-100">
      {title}
    </summary>
    <div className="px-3 py-2 text-gray-700 text-sm">{content}</div>
  </details>
);

export default SummaryItem;
