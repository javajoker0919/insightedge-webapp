"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { IoHomeOutline, IoPersonOutline, IoAddOutline } from "react-icons/io5";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
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
      <nav
        className={`bg-white text-gray-800 ${
          isCollapsed ? "w-24" : "w-80"
        } transition-all overflow-hidden duration-300 left-0 border-r border-gray-200 shadow-md flex flex-col justify-between`}
      >
        <div className="p-4">
          <ul>
            <li className="mb-3">
              <Link
                href="/app"
                className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                <IoHomeOutline className={`text-indigo-600 text-2xl`} />
                {!isCollapsed && (
                  <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-lg">
                    Home
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/app/company-profile"
                className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                <IoPersonOutline className={`text-indigo-600 text-2xl`} />
                {!isCollapsed && (
                  <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-lg">
                    Company Profile
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        <hr />

        <div className="p-2">
          <div className="flex items-center justify-between w-full gap-4">
            {!isCollapsed && (
              <span className="text-gray-500 pl-6 hover:text-indigo-600 transition-colors duration-200 text-base">
                WATCHLISTS
              </span>
            )}
            <button
              onClick={openModal}
              className="p-3 rounded-full hover:bg-indigo-100 transition-all duration-200"
            >
              <IoAddOutline className={`text-indigo-600 text-2xl`} />
            </button>
          </div>
        </div>
        <div className="mt-auto border-t p-4">
          <div
            className={`flex items-center space-x-2 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <div className="w-full space-y-3">
                <hr className="border" />
                <hr className="border" />
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-indigo-600 border border-indigo-200 hover:text-indigo-800 focus:outline-none transition-colors duration-200 px-2 py-1 rounded-full hover:bg-indigo-100 text-2xl"
            >
              {isCollapsed ? "→" : "←"}
            </button>
            {!isCollapsed && (
              <div className="w-full space-y-3">
                <hr className="border" />
                <hr className="border" />
              </div>
            )}
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white text-black space-y-8 min-w-96 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl">Create a new list</h2>
            <input
              type="text"
              placeholder="List name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-800 rounded hover:bg-gray-100 transition-colors duration-200 w-24"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  /* Add your save logic here */
                }}
                disabled={!inputValue.trim()}
                className={`px-4 py-2 rounded transition-colors duration-200 w-24 ${
                  inputValue.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-white cursor-not-allowed"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
