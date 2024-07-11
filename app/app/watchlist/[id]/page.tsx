"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { IoAddOutline, IoPencil, IoTrash, IoClose } from "react-icons/io5";

import { supabase } from "@/utils/supabaseClient";
import { watchlistAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";

import "swiper/css";
import "swiper/css/navigation";

export default function WatchlistPage() {
  const params = useParams();
  const paramID = params.id as string;

  const watchlist = useAtomValue(watchlistAtom);
  const [watchlistName, setWatchlistName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "rename" | "delete">(
    "add"
  );
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false);
  const optionsModalRef = useRef<HTMLDivElement>(null);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<"all" | "name" | "symbol">(
    "all"
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [watchlistCompanies, setWatchlistCompanies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWatchlistData() {
      setIsLoading(true);
      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlists")
        .select("id, name")
        .eq("uuid", paramID)
        .single();

      if (watchlistError) {
        console.error("Error fetching watchlist:", watchlistError);
      } else if (watchlistData) {
        setWatchlistName(watchlistData.name);

        const { data: companiesData, error: companiesError } = await supabase
          .from("watchlist_companies")
          .select(
            `
            id,
            companies (
              id,
              name,
              symbol
            )
          `
          )
          .eq("watchlist_id", watchlistData.id);

        if (companiesError) {
          console.error("Error fetching watchlist companies:", companiesError);
        } else {
          setWatchlistCompanies(
            companiesData.map((item) => ({
              ...item.companies,
              watchlist_company_id: item.id,
            }))
          );
        }
      }
      setIsLoading(false);
    }

    fetchWatchlistData();
  }, [paramID]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsModalRef.current &&
        !optionsModalRef.current.contains(event.target as Node)
      ) {
        setIsOptionsModalOpen(false);
      }
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearchBarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    if (isSearchBarOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchBarOpen]);

  const toggleOptionsModal = () => {
    setIsOptionsModalOpen(!isOptionsModalOpen);
  };

  const handleRenameWatchlist = () => {
    setModalType("rename");
    setIsModalOpen(true);
  };

  const handleDeleteWatchlist = () => {
    setIsOptionsModalOpen(false);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const handleAddInvestments = () => {
    setIsSearchBarOpen(true);
  };

  const handleCloseSearchBar = () => {
    setIsSearchBarOpen(false);
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

  const handleRemoveCompanyFromWatchlist = async (
    watchlistCompanyId: number
  ) => {
    const { error } = await supabase
      .from("watchlist_companies")
      .delete()
      .eq("id", watchlistCompanyId);

    if (error) {
      console.error("Error removing company from watchlist:", error);
    } else {
      setWatchlistCompanies((prevCompanies) =>
        prevCompanies.filter(
          (company) => company.watchlist_company_id !== watchlistCompanyId
        )
      );
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-1">
      <div className="flex-1 w-full items-center flex justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            <h1>Loading</h1>
          </div>
        ) : (
          <div className="w-full h-full justify-between items-center flex relative flex-col">
            <div className="w-full flex max-w-[900px] items-center justify-between relative px-4 py-2">
              <h1>{watchlistName}</h1>
              <div className="flex items-center gap-2">
                {watchlistCompanies.length > 0 && (
                  <button
                    className="rounded-full p-2 text-indigo-500 hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleAddInvestments}
                  >
                    <IoAddOutline className="text-xl" />
                    <p>Add companies</p>
                  </button>
                )}
                {watchlist && watchlist[0] && paramID !== watchlist[0].uuid && (
                  <button
                    onClick={toggleOptionsModal}
                    className="hover:bg-gray-100 rounded-full w-12 h-12 items-center justify-center gap-0.5 bg-white flex flex-col"
                  >
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="rounded-full w-1 h-1 bg-black mb-0.5"
                      />
                    ))}
                  </button>
                )}
              </div>
              {isOptionsModalOpen && (
                <div
                  ref={optionsModalRef}
                  className="absolute w-52 py-1 border border-gray-100 right-4 top-14 bg-white shadow-md rounded-md overflow-hidden"
                >
                  <button
                    onClick={handleRenameWatchlist}
                    className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100"
                  >
                    <IoPencil className="text-gray-600 text-xl" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={handleDeleteWatchlist}
                    className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 text-red-500"
                  >
                    <IoTrash className="text-red-500 text-xl" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 px-4 py-2">
              {watchlistCompanies.length === 0 ? (
                <>
                  <p>Nothing in this watchlist yet</p>
                  <p className="text-gray-500">
                    Track investments you care about here
                  </p>
                  <button
                    className="rounded-full p-2 text-indigo-500 hover:bg-gray-100 flex items-center gap-2"
                    onClick={handleAddInvestments}
                  >
                    <IoAddOutline className="text-xl" />
                    <p>Add companies</p>
                  </button>
                </>
              ) : (
                <div className="w-full max-w-[900px] px-4 mb-auto">
                  {watchlistCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="py-2 pl-4 pr-2 hover:bg-gray-50 border-t last:border-b-0 flex justify-between items-center group"
                    >
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-gray-500 text-sm">
                          {company.symbol}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveCompanyFromWatchlist(
                            company.watchlist_company_id
                          )
                        }
                        className="text-gray-500 hover:bg-gray-200 p-2.5 rounded-full hidden group-hover:block"
                      >
                        <IoClose className="text-2xl" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isSearchBarOpen && (
              <div
                id="search-bar"
                ref={searchBarRef}
                className="absolute w-full max-w-[900px] p-4 flex justify-center"
              >
                <div className="shadow-lg w-full border overflow-hidden bg-white border-gray-100 rounded-xl relative">
                  <button
                    onClick={handleCloseSearchBar}
                    className="absolute top-2 right-2 hover:bg-gray-200 rounded-full p-2"
                  >
                    <IoClose className="text-2xl" />
                  </button>
                  <input
                    ref={searchInputRef}
                    className="w-full p-4 rounded-md focus:outline-none"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for companies..."
                  />
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
                    {isSearching ? (
                      <div className="py-4 px-4 flex justify-center items-center">
                        <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
                      </div>
                    ) : (
                      searchResults.map((company) => (
                        <div
                          key={company.id}
                          className="py-2 px-5 bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                          onClick={() =>
                            handleAddCompanyToWatchlist(company.id)
                          }
                        >
                          <p className="font-medium">{company.name}</p>
                          <p className="text-gray-500 text-sm">
                            {company.symbol}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <WatchlistModal
        type={modalType}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
