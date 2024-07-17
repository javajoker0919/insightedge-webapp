import { useState, useRef, useEffect } from "react";
import { ShareSvg } from ".";
import {
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaTimes,
  FaLink,
} from "react-icons/fa";

const ShareButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    // Optionally, you can add a toast notification here to inform the user that the link has been copied
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={handleShare}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 focus:outline-none flex items-center transition duration-150 ease-in-out"
      >
        <ShareSvg />
        Share
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 !m-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg overflow-hidden shadow-xl w-96 max-w-md"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Share</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 transition duration-150 ease-in-out"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-around mb-4">
                <div className="flex flex-col items-center w-20">
                  <button className="p-3 bg-blue-600 text-white rounded-full mb-2 hover:bg-blue-700 transition duration-150 ease-in-out">
                    <FaFacebook className="h-6 w-6" />
                  </button>
                  <span className="text-sm text-gray-600">Facebook</span>
                </div>
                <div className="flex flex-col items-center w-20">
                  <button className="p-3 bg-blue-400 text-white rounded-full mb-2 hover:bg-blue-500 transition duration-150 ease-in-out">
                    <FaTwitter className="h-6 w-6" />
                  </button>
                  <span className="text-sm text-gray-600">Twitter</span>
                </div>
                <div className="flex flex-col items-center w-20">
                  <button className="p-3 bg-red-500 text-white rounded-full mb-2 hover:bg-red-600 transition duration-150 ease-in-out">
                    <FaEnvelope className="h-6 w-6" />
                  </button>
                  <span className="text-sm text-gray-600">Email</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 gap-2 p-4 flex items-center justify-between">
              <div className="flex flex-1 w-20 items-center">
                <FaLink className="h-5 w-5 mr-2" />
                <span className="text-sm truncate">{window.location.href}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="p-1 w-16 text-center text-sm font-medium text-blue-500"
              >
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
