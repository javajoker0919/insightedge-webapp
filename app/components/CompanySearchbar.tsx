import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { watchlistAtom } from "@/utils/atoms";
import { IoClose } from "react-icons/io5";

interface CompanySearchbarProps {
  type: string; //  "header" | "watchlist"
  isSearchBarOpen: boolean;
  setIsSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWatchlistCompanies: React.Dispatch<React.SetStateAction<any[]>>;
}

const CompanySearchbar = ({
  type,
  isSearchBarOpen,
  setIsSearchBarOpen,
  setWatchlistCompanies,
}: CompanySearchbarProps) => {
  const params = useParams();
  const paramID = params.id as string;

  const router = useRouter();

  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const watchlist = useAtomValue(watchlistAtom);
  const [searchInput, setSearchInput] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        if (type === "header") {
          setIsInputFocused(false);
        }
        if (type === "watchlist") {
          setIsSearchBarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (type === "watchlist" && isSearchBarOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchBarOpen]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsSearching(true);
      let query = supabase
        .from("companies")
        .select("id, name, symbol")
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

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching search results:", error);
      } else {
        setSearchResults(data || []);
      }
      setIsSearching(false);
    };

    const debounce = setTimeout(() => {
      fetchSearchResults();
    }, 800);

    return () => clearTimeout(debounce);
  }, [searchInput, searchType]);

  const handleCloseSearchBar = () => {
    if (type === "header") {
      setSearchInput("");
    } else if (type === "watchlist") {
      setIsSearchBarOpen(false);
    }
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
      console.log("Company added to watchlist successfully");
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

  const handleCompanyClick = (companyID: number) => {
    setIsInputFocused(false);

    switch (type) {
      case "header":
        router.push(`/app/company/${companyID}`);
        break;

      case "watchlist":
        handleAddCompanyToWatchlist(companyID);
        break;

      default:
        break;
    }
  };

  return (
    <div
      id="search-bar"
      ref={searchBarRef}
      className={`absolute w-full max-w-[900px] flex justify-center ${
        type === "header" ? "" : "p-2"
      }`}
    >
      <div
        className={`${
          isInputFocused ? (type === "header" ? "shadow-2xl" : "shadow-lg") : ""
        } w-full border overflow-hidden bg-white border-gray-100 rounded-xl relative`}
      >
        {isInputFocused && (
          <div className="absolute top-2 right-2 flex items-center">
            {isSearching && (
              <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mr-2" />
            )}
            <button
              onClick={handleCloseSearchBar}
              className="hover:bg-gray-200 rounded-full p-2"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}

        <input
          ref={searchInputRef}
          className={`w-full p-4 rounded-md focus:outline-none ${
            isInputFocused ? "" : "bg-gray-100"
          }`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for companies..."
          onFocus={() => setIsInputFocused(true)}
          // onBlur={() => setIsInputFocused(false)}
        />

        {isInputFocused && (
          <>
            <div className="flex space-x-2 py-2 px-4 border-t">
              {["all", "name", "symbol"].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-0.5 text-gray-500 rounded-full ${
                    searchType === type
                      ? "bg-indigo-100 text-indigo-700"
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
                  className="py-2 px-5 bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleCompanyClick(company.id)}
                >
                  <p className="font-medium">{company.name}</p>
                  <p className="text-gray-500 text-sm">{company.symbol}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanySearchbar;
