"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";
import { useAtom } from "jotai";
import { userMetadataAtom } from "@/utils/atoms";

const Header: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [, setUserMetadata] = useAtom(userMetadataAtom);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUserMetadata(null);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="p-4 bg-white z-10 shadow-md">
      <nav className="mx-auto flex justify-between items-center px-4">
        <a
          href="/"
          className="text-2xl font-bold text-indigo-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
          InsightEdge
        </a>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-red-600 text-white w-24 px-4 py-2 rounded-full flex items-center justify-center"
        >
          {isLoading ? (
            <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
          ) : (
            "Log out"
          )}
        </button>
      </nav>
    </header>
  );
};

export default Header;
