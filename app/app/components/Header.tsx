"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useAtom, useSetAtom } from "jotai";
import {
  userMetadataAtom,
  userInfoAtom,
  orgInfoAtom,
  watchlistAtom,
  isSidebarExpandedAtom,
} from "@/utils/atoms";
import Image from "next/image";
import Link from "next/link";
import CompanySearchbar from "@/app/components/CompanySearchbar";
import { IoMenu } from "react-icons/io5";

const Header: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const setIsSidebarExpanded = useSetAtom(isSidebarExpandedAtom);
  const router = useRouter();
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      setUserMetadata(null);
      setUserInfo(null);
      setOrgInfo(null);
      setWatchlist(null);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCreditCount = async () => {
      try {
        if (userInfo) {
          const { data, error } = await supabase
            .from("user_packages")
            .select("value")
            .eq("user_id", userInfo.id)
            .eq("package_id", 1)
            .single();
          if (error) {
            throw error;
          }

          setUserInfo((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              creditCount: parseInt(data.value),
            };
          });
        }
      } catch (error) {
        console.error("Error fetching credit count:", error);
      }
    };

    fetchCreditCount();
  }, [userInfo?.email]);

  return (
    <header className="py-3 bg-white z-20 shadow-md sticky top-0">
      <nav className="mx-auto flex justify-between items-center pr-4 pl-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSidebarExpanded(true)}
            className="hover:bg-gray-100 rounded-full p-3"
          >
            <IoMenu className="text-2xl" />
          </button>
          <Link
            href="/"
            className={`text-2xl font-bold gap-2 text-primary-600 flex items-center`}
          >
            <Image
              src={"/logo.png"}
              alt={"ProspectEdge"}
              width={200}
              height={40}
            />
          </Link>
        </div>

        <div className="relative h-10 w-[700px]">
          <CompanySearchbar
            type="header"
            isSearchBarOpen={true}
            setIsSearchBarOpen={() => {}}
            setWatchlistCompanies={() => {}}
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              router.push("/app/membership");
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            {`Credits: ${userInfo?.creditCount}`}
          </button>

          <div className="relative min-h-10 min-w-10" ref={dropdownRef}>
            <Image
              onClick={toggleDropdown}
              src="/default_avatar.jpeg"
              alt="User avatar"
              width={40}
              height={40}
              className="hover:cursor-pointer"
            />

            {isDropdownOpen && (
              <div className="absolute border border-gray-200 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href={`/app/watchlist/${watchlist?.[0]?.uuid}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  Dashboard
                </Link>
                <Link
                  href="/app/settings/my-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  {"Log out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
