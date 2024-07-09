"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { IoHomeOutline, IoList, IoPersonOutline } from "react-icons/io5";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  return (
    <nav
      className={`bg-white text-gray-800 ${
        isCollapsed ? "w-24" : "w-80"
      } transition-all overflow-hidden duration-300 left-0 border-r border-gray-200 shadow-md flex flex-col justify-between`}
    >
      <div className="p-4">
        <ul>
          <li className="mb-3">
            <Link
              href="#"
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
          <li className="mb-3">
            <Link
              href="#"
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
          <li className="mb-3">
            <Link
              href="#"
              className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              <IoList className={`text-indigo-600 text-2xl`} />
              {!isCollapsed && (
                <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-lg">
                  Watchlist
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-auto border-t p-4">
        {/* <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white"
        >
          <IoLogOutOutline
            className={`${isCollapsed ? "text-3xl" : "mr-4 text-2xl"}`}
          />
          {!isCollapsed && (
            <span className="text-lg">
              {isLoading ? "Logging out..." : "Log Out"}
            </span>
          )}
        </button> */}
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
  );
};

export default Sidebar;
