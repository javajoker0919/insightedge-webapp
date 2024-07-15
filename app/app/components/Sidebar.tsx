"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";

import {
  IoHomeOutline,
  IoPersonOutline,
  IoAddOutline,
  IoMenu,
} from "react-icons/io5";
import { watchlistAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";

const Sidebar: React.FC = () => {
  const params = useParams();
  const paramUUID = params.id as string;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const watchlist = useAtomValue(watchlistAtom);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <nav
        className={`bg-white text-gray-800 shrink-0 ${
          isCollapsed ? "w-24" : "w-80"
        } transition-all overflow-hidden duration-300 left-0 border-r border-gray-200 shadow-md flex flex-col justify-between`}
      >
        <div className="p-3">
          <Link
            href="/"
            className={`text-2xl font-bold gap-2 ${
              isCollapsed ? "justify-center" : "justify-start"
            } text-indigo-600 flex items-center p-3`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            {!isCollapsed && "InsightEdge"}
          </Link>
          <ul>
            <li className="mb-1">
              <Link
                href={`/app${
                  watchlist?.[0]?.uuid ? `/watchlist/${watchlist[0].uuid}` : ""
                }`}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : ""
                } gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
              >
                <IoHomeOutline className={`text-2xl`} />
                {!isCollapsed && (
                  <span className="text-gray-700 transition-colors duration-200 text-lg">
                    Home
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/app/company-profile"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : ""
                } gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
              >
                <IoPersonOutline className={`text-2xl`} />
                {!isCollapsed && (
                  <span className="text-gray-700 transition-colors duration-200 text-lg">
                    Company Profile
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        <hr />

        <div className="p-3">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } w-full gap-4`}
          >
            {!isCollapsed && (
              <span className="text-gray-500 pl-4 transition-colors duration-200 text-base">
                WATCHLISTS
              </span>
            )}
            <button
              onClick={openModal}
              className="p-3 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <IoAddOutline className={`text-2xl`} />
            </button>
          </div>
          <ul>
            {watchlist &&
              watchlist.map((item) => {
                return (
                  <li key={item.uuid} className="mb-0.5">
                    <Link
                      href={`/app/watchlist/${item.uuid}`}
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : ""
                      } gap-4 py-3 px-4 rounded-lg transition-all duration-200 ${
                        paramUUID === item.uuid
                          ? "bg-indigo-50"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <IoMenu className={`text-2xl shrink-0`} />
                      {!isCollapsed && (
                        <span className="text-gray-700 truncate transition-colors duration-200 text-lg">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
          </ul>
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
              className="text-indigo-600 border border-indigo-200 hover:text-indigo-800 focus:outline-none transition-colors duration-200 px-2 py-1 rounded-full hover:bg-gray-100 text-2xl"
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

      <WatchlistModal
        type="add"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default Sidebar;
