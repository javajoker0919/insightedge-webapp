"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";

import {
  IoHomeOutline,
  IoPersonOutline,
  IoAddOutline,
  IoMenu,
} from "react-icons/io5";
import { watchlistAtom, isSidebarExpandedAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";

const Sidebar: React.FC = () => {
  const params = useParams();
  const paramUUID = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useAtom(isSidebarExpandedAtom);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const watchlist = useAtomValue(watchlistAtom);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsExpanded]);

  return (
    <>
      <nav
        ref={sidebarRef}
        className={`bg-white w-64 z-50 h-screen top-0 absolute text-gray-800 shrink-0 ${
          isExpanded ? "left-0" : "-left-64"
        } transition-all overflow-y-auto overflow-x-hidden duration-300 border-r border-gray-200 shadow-md flex flex-col`}
      >
        <div className="p-3">
          <Link
            href="/"
            className={`text-2xl font-bold gap-2 text-indigo-600 flex items-center p-3`}
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
            {"InsightEdge"}
          </Link>
          <ul>
            <li className="mb-1">
              <Link
                href={`/app${
                  watchlist?.[0]?.uuid ? `/watchlist/${watchlist[0].uuid}` : ""
                }`}
                onClick={() => setIsExpanded(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
              >
                <IoHomeOutline className={`text-2xl`} />

                <span className="text-gray-700 transition-colors duration-200 text-lg">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/app/company-profile"
                onClick={() => setIsExpanded(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
              >
                <IoPersonOutline className={`text-2xl`} />

                <span className="text-gray-700 transition-colors duration-200 text-lg">
                  Company Profile
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <hr />

        <div className="p-3">
          <div className={`flex items-center justify-between w-full gap-4`}>
            <span className="text-gray-500 pl-4 transition-colors duration-200 text-base">
              WATCHLISTS
            </span>

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
                      onClick={() => setIsExpanded(false)}
                      className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-200 ${
                        paramUUID === item.uuid
                          ? "bg-indigo-50"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <IoMenu className={`text-2xl shrink-0`} />

                      <span className="text-gray-700 truncate transition-colors duration-200 text-lg">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        {/* <div className="mt-auto border-t p-4">
          <div className={`flex items-center space-x-2 justify-between`}>
            <div className="w-full space-y-3">
              <hr className="border" />
              <hr className="border" />
            </div>

            <button
              onClick={toggleSidebar}
              className="text-indigo-600 border border-indigo-200 hover:text-indigo-800 focus:outline-none transition-colors duration-200 px-2 py-1 rounded-full hover:bg-gray-100 text-2xl"
            >
              {"←"}
            </button>

            <div className="w-full space-y-3">
              <hr className="border" />
              <hr className="border" />
            </div>
          </div>
        </div> */}
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
