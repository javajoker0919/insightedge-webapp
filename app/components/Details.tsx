"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<"auto" | number>("auto");

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [children]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (typeof onToggle === "function") onToggle(!isOpen);
  };

  return (
    <div
      className={
        "mb-2 bg-gray-50 overflow-hidden rounded border border-gray-200 " +
        wrapperClass
      }
    >
      <div
        className={
          "px-3 py-2 cursor-pointer text-base font-medium text-gray-600 hover:bg-gray-100 flex items-center " +
          headClass
        }
        onClick={toggleOpen}
      >
        {type === "main" ? (
          <motion.svg
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.1 }}
            className={"mr-2 text-gray-500 w-4 h-4 " + iconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </motion.svg>
        ) : (
          <motion.svg
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.1 }}
            className={"mr-2 text-gray-500 w-4 h-4 " + iconClass}
            viewBox="0 0 20 20"
            fill="currentColor"
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
          </motion.svg>
        )}
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
            <div className={innerClass || ""} ref={contentRef}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Details;
