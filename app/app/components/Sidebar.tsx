"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";

import {
  IoHomeOutline,
  IoAddOutline,
  IoMenu,
  IoSettingsOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { watchlistAtom, isSidebarExpandedAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";
import Image from "next/image";
import { Logo } from "@/app/components";
import { getMixPanelClient } from "@/utils/mixpanel";

const Sidebar: React.FC = () => {
  const params = useParams();
  const paramUUID = params.id as string;
  const mixpanel = getMixPanelClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useAtom(isSidebarExpandedAtom);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const watchlist = useAtomValue(watchlistAtom);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const openModal = () => {
    mixpanel.track("watchlist.create", {
      $source: "main.sidebar",
    });

    setIsModalOpen(true);
  };

  const toggleSettings = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
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
        <div className="p-6">
          <Logo
            onClick={() => {
              mixpanel.track("logo.click", {
                $source: "main.sidebar",
              });
            }}
          />
        </div>
        <SidebarMenu
          setIsExpanded={setIsExpanded}
          isSettingsExpanded={isSettingsExpanded}
          toggleSettings={toggleSettings}
        />
        <hr></hr>
        <SidebarFooter
          openModal={openModal}
          watchlist={watchlist}
          paramUUID={paramUUID}
          setIsExpanded={setIsExpanded}
        />
      </nav>

      <WatchlistModal
        type="add"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

const SidebarMenu: React.FC<{
  setIsExpanded: (value: boolean) => void;
  isSettingsExpanded: boolean;
  toggleSettings: () => void;
}> = ({ setIsExpanded, isSettingsExpanded, toggleSettings }) => {
  const mixpanel = getMixPanelClient();

  return (
    <div className="p-3">
      <ul>
        <li className="mb-1">
          <Link
            href="/app"
            onClick={() => {
              mixpanel.track("goto.dashboard", {
                $source: "main.sidebar",
              });
              setIsExpanded(false);
            }}
            className={`flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
          >
            <IoHomeOutline className={`text-2xl`} />
            <span className="text-gray-700 transition-colors duration-200 text-lg">
              Home
            </span>
          </Link>
        </li>
        <li>
          <button
            onClick={toggleSettings}
            className={`flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200 w-full text-left`}
          >
            <IoSettingsOutline className={`text-2xl`} />
            <span className="text-gray-700 transition-colors duration-200 text-lg">
              Settings
            </span>
            {isSettingsExpanded ? (
              <IoChevronDownOutline className={`text-xl ml-auto`} />
            ) : (
              <IoChevronForwardOutline className={`text-xl ml-auto`} />
            )}
          </button>
          <div
            className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
              isSettingsExpanded ? "max-h-96" : "max-h-0"
            }`}
          >
            {isSettingsExpanded && (
              <ul className="pl-8">
                <li>
                  <Link
                    href="/app/settings/my-profile"
                    onClick={() => setIsExpanded(false)}
                    className={`flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
                  >
                    <span className="text-gray-700 transition-colors duration-200 text-base">
                      My Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/app/settings/company-profile"
                    onClick={() => setIsExpanded(false)}
                    className={`flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
                  >
                    <span className="text-gray-700 transition-colors duration-200 text-base">
                      Company Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/app/settings/billing"
                    onClick={() => setIsExpanded(false)}
                    className={`flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
                  >
                    <span className="text-gray-700 transition-colors duration-200 text-base">
                      Billing
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/app/settings/plans"
                    onClick={() => setIsExpanded(false)}
                    className={`flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
                  >
                    <span className="text-gray-700 transition-colors duration-200 text-base">
                      Plans
                    </span>
                  </Link>
                </li>
                {/* <li>
                <Link
                  href="/app/settings/usage"
                  onClick={() => setIsExpanded(false)}
                  className={`flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all duration-200`}
                >
                  <span className="text-gray-700 transition-colors duration-200 text-lg">
                    Usage
                  </span>
                </Link>
              </li> */}
              </ul>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

const SidebarFooter: React.FC<{
  openModal: () => void;
  watchlist: any;
  paramUUID: string;
  setIsExpanded: (value: boolean) => void;
}> = ({ openModal, watchlist, paramUUID, setIsExpanded }) => (
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
        watchlist.map((item: any) => {
          return (
            <li key={item.uuid} className="mb-0.5">
              <Link
                href={`/app/watchlist/${item.uuid}`}
                onClick={() => setIsExpanded(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-200 ${
                  paramUUID === item.uuid
                    ? "bg-primary-50"
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
);

export default Sidebar;
