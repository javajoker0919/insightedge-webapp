"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { useAtomValue } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { watchlistAtom } from "@/utils/atoms";
import { CompanyProps } from "./InitialCompanySection";

interface CompanySearchbarProps {
  isSearchBarOpen: boolean;
  setIsSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWatchlistCompanies: React.Dispatch<React.SetStateAction<any[]>>;
  companies: CompanyProps[];
  setCompanies: React.Dispatch<React.SetStateAction<CompanyProps[]>>;
}

const OnboardCompanySearchbar = ({
  isSearchBarOpen,
  setIsSearchBarOpen,
  setWatchlistCompanies,
  companies,
  setCompanies,
}: CompanySearchbarProps) => {
  const params = useParams();
  const paramID = params.id as string;

  const router = useRouter();

  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const watchlist = useAtomValue(watchlistAtom);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<CompanyProps[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput, searchType]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setIsInputFocused(false);
    }
  };

  const fetchSearchResults = async () => {
    setIsSearching(true);
    let query = supabase
      .from("companies")
      .select("id, name, symbol, industry")
      .limit(5);

    if (searchInput.length > 0) {
      if (searchType === "all") {
        query = query.or(
          `name.ilike.%${searchInput}%,symbol.ilike.%${searchInput}%`
        );
      } else if (searchType === "name") {
        query = query.ilike("name", `%${searchInput}%`);
      } else if (searchType === "symbol") {
        query = query.ilike("symbol", `%${searchInput}%`);
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
    setSearchInput("");
  };

  const handleAddCompanyToWatchlist = async (companyId: number) => {
    const watchlistId = watchlist?.find((item) => item.uuid === paramID)?.id;

    if (!watchlistId) {
      console.error("Watchlist ID not found");
      return;
    }

    const { data, error } = await supabase
      .from("watchlist_companies")
      .insert({ company_id: companyId, watchlist_id: watchlistId })
      .select();

    if (error) {
      console.error("Error adding company to watchlist:", error);
    } else {
      setIsSearchBarOpen(false);

      // Fetch the newly added company and update the state
      const { data: newCompany, error: fetchError } = await supabase
        .from("companies")
        .select("id, name, symbol")
        .eq("id", companyId)
        .single();

      if (fetchError) {
        console.error("Error fetching new company:", fetchError);
      } else if (data && data.length > 0) {
        setWatchlistCompanies((prevCompanies) => [
          ...prevCompanies,
          { ...newCompany, watchlist_company_id: data[0].id },
        ]);
      }
    }
  };

  const handleCompanyClick = (company: CompanyProps) => {
    if (companies.map((company) => company.id).includes(company.id)) {
      return;
    }

    // setIsInputFocused(false);

    setCompanies((prev) => {
      return [...prev, company];
    });
  };

  return (
    <div
      id="search-bar"
      ref={searchBarRef}
      className={`absolute w-full flex justify-center`}
    >
      <div
        className={`${
          isInputFocused ? "shadow-2xl" : ""
        } w-full border overflow-hidden bg-white relative rounded-md`}
      >
        {isInputFocused && (
          <div className={`absolute top-1 right-1 flex items-center`}>
            {isSearching && (
              <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500 mr-2" />
            )}
            <button
              onClick={handleCloseSearchBar}
              className={`hover:bg-gray-200 rounded-full p-1`}
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}

        <input
          ref={searchInputRef}
          className={`w-full rounded-md focus:outline-none ${
            isInputFocused ? "" : "bg-gray-50"
          } p-3`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for companies..."
          onFocus={() => setIsInputFocused(true)}
          // onBlur={() => setIsInputFocused(false)}
        />

        {isInputFocused && (
          <>
            <div className="flex justify-start space-x-2 py-2 px-4 border-t">
              {["all", "name", "symbol"].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-0.5 text-gray-500 rounded-full ${
                    searchType === type
                      ? "bg-primary-100 text-primary-700"
                      : "bg-white hover:bg-gray-100"
                  }`}
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
                  className={`py-2 px-5  ${
                    companies.map((company) => company.id).includes(company.id)
                      ? "bg-gray-100 cursor-not-allowed"
                      : "cursor-pointer bg-white hover:bg-gray-100"
                  } transition-colors duration-200 flex justify-between items-center`}
                  onClick={() => handleCompanyClick(company)}
                >
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-gray-500 text-sm">{company.symbol}</p>
                  </div>
                  <p className="text-gray-500 text-sm rounded-full py-1 px-3 bg-yellow-50 border-yellow-200 border">
                    {company.industry}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardCompanySearchbar;
