import { useState } from "react";

interface SummaryItemProps {
  title: string;
  content: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <details
      className="mb-2 bg-gray-50 overflow-hidden rounded border border-gray-200"
      open={isOpen}
    >
      <summary
        className="px-3 py-2 cursor-pointer text-base font-medium text-gray-600 hover:bg-gray-100 flex items-center"
        onClick={(e) => {
          e.preventDefault();
          toggleOpen();
        }}
      >
        {isOpen ? (
          <svg
            className="mr-2 text-gray-500 w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="mr-2 text-gray-500 w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {title}
      </summary>
      <div className="px-3 py-2 text-gray-700 text-sm">{content}</div>
    </details>
  );
};

export default SummaryItem;
