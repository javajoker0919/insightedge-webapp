"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { watchlistAtom } from "@/utils/atoms";
import { IoClose } from "react-icons/io5";

interface CompanySearchbarProps {
  setCompanyID: (id: number) => void;
  isCompanySelected: boolean;
}

const LandingCompanySearchbar = ({ setCompanyID }: CompanySearchbarProps) => {
  const params = useParams();
  const paramID = params.id as string;

  const router = useRouter();

  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const watchlist = useAtomValue(watchlistAtom);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const rotatingCompanies = [
    "Apple",
    "Nvidia",
    "Tesla",
    "Eli Lilly",
    "Walmart",
  ];
  const rotationIndexRef = useRef<number>(0);
  const typingSpeedRef = useRef<number>(100); // milliseconds per character

  const fetchAndUpdateCompany = async (companyName: string) => {
    setIsSearching(true);
    const { data, error } = await supabase
      .from("companies_with_summaries_view_v1")
      .select("id, name, symbol, industry")
      .or(`name.ilike.%${companyName}%,symbol.ilike.%${companyName}%`)
      .order("revrank", { ascending: true })
      .limit(1);

    if (error) {
      console.error("Error fetching company:", error);
      setIsSearching(false);
      return;
    }

    if (data && data.length > 0) {
      const selectedCompany = data[0];
      setCompanyID(selectedCompany.id);
      console.log(
        `Updated company: ${selectedCompany.name} (ID: ${selectedCompany.id})`
      );
      // If you have a specific function to update the companysection, call it here
      // For example: updateCompanySection(selectedCompany);
    } else {
      console.log(`No company found for: ${companyName}`);
    }

    setIsSearching(false);
  };

  useEffect(() => {
    let rotationTimeout: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;

    const simulateTypingAndSearch = () => {
      const company = rotatingCompanies[rotationIndexRef.current];
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < company.length) {
          setSearchInput((prev) => company.slice(0, charIndex + 1));
          charIndex++;
          typingInterval = setTimeout(typeNextChar, typingSpeedRef.current);
        } else {
          // Simulate pressing enter and update companysection
          fetchAndUpdateCompany(company);
          // Wait for 5 seconds before starting the next company
          rotationTimeout = setTimeout(() => {
            setSearchInput("");
            rotationIndexRef.current =
              (rotationIndexRef.current + 1) % rotatingCompanies.length;
            simulateTypingAndSearch();
          }, 5000); // 5 seconds delay
        }
      };

      typeNextChar();
    };

    if (isRotating) {
      simulateTypingAndSearch();
    }

    return () => {
      clearTimeout(rotationTimeout);
      clearTimeout(typingInterval);
    };
  }, [isRotating]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput, searchType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setIsInputFocused(false);
    }
  };

  const fetchSearchResults = async (input: string = searchInput) => {
    setIsSearching(true);
    let query = supabase
      .from("companies_with_summaries_view_v1")
      .select("id, name, symbol, industry")
      .limit(5);

    if (input.length > 0) {
      if (searchType === "all") {
        query = query.or(`name.ilike.%${input}%,symbol.ilike.%${input}%`);
      } else if (searchType === "name") {
        query = query.ilike("name", `%${input}%`);
      } else if (searchType === "symbol") {
        query = query.ilike("symbol", `%${input}%`);
      }
    }

    query = query.order("revrank", { ascending: true });

    if (searchType === "symbol") {
      query = query
        .order("symbol", { ascending: true })
        .order("name", { ascending: true });
    } else {
      query = query
        .order("name", { ascending: true })
        .order("symbol", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching search results:", error);
    } else {
      setSearchResults(data || []);
    }
    setIsSearching(false);
  };

  const handleCloseSearchBar = () => {
    if (searchInput) {
      setSearchInput("");
    } else {
      setIsInputFocused(false);
    }
  };

  const handleCompanyClick = (companyID: number) => {
    setIsInputFocused(false);
    setCompanyID(companyID);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setIsRotating(false);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setIsRotating(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <p className="text-lg font-medium mb-2 text-gray-700">
        Try a company and test for yourself
      </p>
      <div
        id="search-bar"
        ref={searchBarRef}
        className="w-full flex justify-center relative"
      >
        <div
          className={`${
            isInputFocused ? "shadow-2xl -translate-y-1 z-20" : "shadow-md"
          } w-full border border-gray-200 overflow-hidden bg-white absolute top-full left-0 rounded-md transition-all duration-200`}
        >
          {isInputFocused && (
            <div className="absolute top-2 right-2 flex items-center">
              {isSearching && (
                <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500 mr-2" />
              )}
              <button
                onClick={handleCloseSearchBar}
                className="hover:bg-gray-200 rounded-full p-1.5"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          )}

          <input
            ref={searchInputRef}
            className={`w-full rounded-md focus:outline-none bg-white px-4 py-3.5 transition-all duration-200 ${
              isInputFocused ? "pr-16" : ""
            }`}
            value={searchInput}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search for companies..."
          />

          {isInputFocused && (
            <>
              <div className="flex justify-start space-x-2 py-2 px-4 border-t">
                {["all", "name", "symbol"].map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 text-sm text-gray-500 rounded-full ${
                      searchType === type
                        ? "bg-primary-100 text-primary-700"
                        : "bg-white hover:bg-gray-100"
                    } transition-colors duration-200`}
                    onClick={() =>
                      setSearchType(type as "symbol" | "all" | "name")
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div className="divide-y">
                {searchResults.map((company) => (
                  <div
                    key={company.id}
                    className="py-2.5 px-5 bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex justify-between items-center"
                    onClick={() => handleCompanyClick(company.id)}
                  >
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-gray-500 text-sm">{company.symbol}</p>
                    </div>
                    <p className="text-gray-500 text-xs rounded-full py-1 px-2 bg-yellow-50 border-yellow-200 border">
                      {company.industry}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingCompanySearchbar;
