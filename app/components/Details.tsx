"use client";
import { useState, useEffect } from "react";

interface DetailsProps {
  title: string;
  type?: string;
  open?: boolean;
  onToggle?: (open: Boolean) => void;
  children: React.ReactNode;
  headClass?: string;
  wrapperClass?: string;
  innerClass?: string;
  iconClass?: string;
}

const Details = ({
  title,
  type = "main",
  open = true,
  onToggle,
  children,
  headClass,
  innerClass,
  wrapperClass,
  iconClass,
}: DetailsProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <details
      open={open}
      className={"mb-2 overflow-y-auto rounded border bg-white border-gray-200 " + wrapperClass}
      onToggle={toggleOpen}
    >
      <summary
        className={"px-3 py-2 cursor-pointer text-base font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 flex items-center " + headClass}
      >
        {type === "main" ? (
          <svg
            className={"mr-2 text-gray-500 w-4 h-4 " + iconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.1s" }}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className={"mr-2 text-gray-500 w-4 h-4 " + iconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.1s" }}
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
        )}
        {title}
      </summary>
      <div className={innerClass || ""}>
        {children}
      </div>
    </details>
  );
};

export default Details;
