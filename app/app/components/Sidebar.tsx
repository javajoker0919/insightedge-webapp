"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import {
  IoHomeOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from "react-icons/io5";

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
        isCollapsed ? "w-20" : "w-80"
      } min-h-screen p-4 transition-all overflow-hidden duration-300 left-0 z-10 border-r border-gray-200 shadow-md flex flex-col justify-between`}
    >
      <div>
        <div
          className={`flex items-center mb-6 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="text-3xl font-bold text-indigo-600 transition-colors duration-200">
              InsightEdge
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors duration-200 p-2 rounded-full hover:bg-indigo-100 text-2xl"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        <ul>
          <li className="mb-3">
            <Link
              href="/"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              <IoHomeOutline
                className={`${
                  isCollapsed ? "text-3xl" : "mr-4 text-2xl"
                } text-indigo-600`}
              />
              {!isCollapsed && (
                <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-lg">
                  Home
                </span>
              )}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/profile"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              <IoPersonOutline
                className={`${
                  isCollapsed ? "text-3xl" : "mr-4 text-2xl"
                } text-indigo-600`}
              />
              {!isCollapsed && (
                <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-lg">
                  Profile
                </span>
              )}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/settings"
              className="flex items-center py-3 px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              <IoSettingsOutline
                className={`${
                  isCollapsed ? "text-3xl" : "mr-4 text-2xl"
                } text-indigo-600`}
              />
              {!isCollapsed && (
                <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 text-lg">
                  Settings
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        <button
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
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
