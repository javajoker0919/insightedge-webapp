import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DetailsProps {
  title: string;
  children: React.ReactNode;
}

const Details = ({ title, children }: DetailsProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2 bg-gray-50 overflow-hidden rounded border border-gray-200">
      <div
        className="px-3 py-2 cursor-pointer text-base font-medium text-gray-600 hover:bg-gray-100 flex items-center"
        onClick={toggleOpen}
      >
        <motion.svg
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.1 }}
          className="mr-2 text-gray-500 w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {isOpen ? (
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          )}
        </motion.svg>
        {title}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: contentHeight }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div ref={contentRef}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Details;
