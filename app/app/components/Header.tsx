"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useSetAtom } from "jotai";
import {
  userMetadataAtom,
  userInfoAtom,
  orgInfoAtom,
  watchlistAtom,
} from "@/utils/atoms";
import Image from "next/image";
import Link from "next/link";
import CompanySearchbar from "@/app/components/CompanySearchbar";

const Header: React.FC = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchlist = useSetAtom(watchlistAtom);
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

  return (
    <header className="p-2 bg-white z-10 shadow-md">
      <nav className="mx-auto flex justify-between items-center px-4">
        <div></div>

        <div className="relative h-14 w-[700px]">
          <CompanySearchbar
            type="header"
            isSearchBarOpen={true}
            setIsSearchBarOpen={() => {}}
            setWatchlistCompanies={() => {}}
          />
        </div>

        <div className="flex items-center space-x-8">
          <Link href="/upgrade">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
              Upgrade
            </button>
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Image
                src="/default_avatar.jpeg"
                alt="User avatar"
                width={40}
                height={40}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute border border-gray-200 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/app/my-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  My Profile
                </Link>
                <Link
                  href="/app/subscription"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  Subscription
                </Link>
                <Link
                  href="/app/manage-users"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  Manage users
                </Link>
                <Link
                  href="/auth/forgot-password"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeDropdown}
                >
                  Forgot Password
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
