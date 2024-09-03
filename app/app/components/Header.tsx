"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import {
  userInfoAtom,
  profileAtom,
  watchlistAtom,
  isSidebarExpandedAtom,
} from "@/utils/atoms";
import { CompanySearchbar, Logo } from "@/app/components";
import { getMixPanelClient } from "@/utils/mixpanel";

const Header: React.FC = () => {
  const router = useRouter();
  const mixpanel = getMixPanelClient();

  const [profile, setProfile] = useAtom(profileAtom);
  const watchlist = useAtomValue(watchlistAtom);
  const setIsSidebarExpanded = useSetAtom(isSidebarExpandedAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isCreditLoaded, setIsCreditLoaded] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setIsLoggingOut(true);

    try {
      await supabase.auth.signOut();
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
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!profile) {
      return;
    }

    if (profile.credits === null) {
      fetchCreditCount(profile.user_id);
    } else if (!isCreditLoaded) {
      setIsCreditLoaded(true);
      fetchCreditCount(profile.user_id);
    }
  }, [profile]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const fetchCreditCount = async (userID: string) => {
    try {
      const { data, error } = await supabase
        .from("user_packages")
        .select("value")
        .eq("user_id", userID)
        .eq("package_id", 1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setUserInfo((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            creditCount: parseInt(data?.value),
          };
        });

        setProfile((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            credits: parseInt(data.value),
          };
        });
      } else {
        setIsCreditLoaded(false);

        setProfile((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            credits: 0,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching credit count:", error);
    }
  };

  return (
    <header className="py-3 bg-white z-20 shadow-md sticky top-0">
      <nav className="mx-auto flex flex-wrap justify-between items-center px-4">
        <div className="flex items-center gap-1 w-full sm:w-auto mb-4 sm:mb-0">
          <button
            onClick={() => setIsSidebarExpanded(true)}
            className="hover:bg-gray-100 rounded-full p-3"
          >
            <IoMenu className="text-2xl" />
          </button>
          <Logo
            onClick={() => {
              mixpanel.track("logo.click", {
                $source: "main.header",
              });
            }}
          />
        </div>

        <div className="relative w-full sm:w-[300px] lg:w-[400px] xl:w-[700px] mb-4 sm:mb-0 h-10">
          <CompanySearchbar
            type="header"
            isSearchBarOpen={true}
            setIsSearchBarOpen={() => {}}
            setWatchlistCompanies={() => {}}
          />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div
            className="flex items-center bg-gray-100 rounded-full px-3 py-2 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 text-xs sm:text-sm"
            onClick={() => {
              router.push("/app/settings/usage");
            }}
          >
            <img
              src="/token.png"
              alt="Credit token"
              className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
            />
            <span className="font-medium text-gray-700">
              Credits:{" "}
              <span className="text-primary-600">{profile?.credits || 0}</span>
            </span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <Image
              onClick={toggleDropdown}
              src="/default_avatar.jpeg"
              alt="User avatar"
              width={40}
              height={40}
              className="hover:cursor-pointer w-8 h-8 sm:w-10 sm:h-10"
            />

            {isDropdownOpen && (
              <div className="absolute border border-gray-200 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/app"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    mixpanel.track("goto.dashboard", {
                      $source: "main.header",
                    });

                    closeDropdown();
                  }}
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
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  {"Sign out"}
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
