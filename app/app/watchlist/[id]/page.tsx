"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { IoAddOutline, IoPencil, IoTrash } from "react-icons/io5";

import { supabase } from "@/utils/supabaseClient";
import { userInfoAtom, watchlistAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";
import CompanySearchbar from "@/app/components/CompanySearchbar";

import { MdAddCircleOutline, MdContentPaste } from "react-icons/md";
import { FaSortAlphaDown } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

import OpportunitiesSection from "./Opportunities/OpportunitiesSection";
import MarketingSection from "../../company/[id]/Marketing/MarketingSection";
import EarningsCalendar from "./EarningsCalendar";
import WLIncomeStatement from "./WLIncomeStatement";

export interface CompanyDataType {
  id: number;
  name: string;
  symbol: string;
  watchlist_company_id: number;
}

export default function WatchlistPage() {
  const params = useParams();
  const paramID = params.id as string;

  const userInfo = useAtomValue(userInfoAtom);
  const watchlist = useAtomValue(watchlistAtom);
  const setWatchlist = useSetAtom(watchlistAtom);
  const [watchlistName, setWatchlistName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "rename" | "delete">(
    "add"
  );
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false);
  const optionsModalRef = useRef<HTMLDivElement>(null);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);
  const [isCompSortAlpha, setIsComptortAlpha] = useState<boolean>(false);
  const [watchlistCompanies, setWatchlistCompanies] = useState<
    CompanyDataType[] | []
  >([]);

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
          const res = companiesData.map((item: any) => ({
            id: item.companies.id,
            name: item.companies.name,
            symbol: item.companies.symbol,
            watchlist_company_id: item.id,
          })) as CompanyDataType[];

          setWatchlistCompanies(res);
        }
      }
      setIsLoading(false);
    }

    fetchWatchlistData();
  }, [paramID]);

  useEffect(() => {
    async function fetchLatestWatchlistsData(userId: string) {
      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlists")
        .select(
          `
          id, 
          name, 
          organization_id, 
          creator_id,
          uuid,
          watchlist_companies!left(id, company_id)
          `
        )
        .eq("creator_id", userId);

      if (watchlistError) throw watchlistError;

      setWatchlist(
        watchlistData.map((item) => {
          return {
            id: item.id,
            name: item.name,
            organizationID: item.organization_id,
            creatorID: item.creator_id,
            uuid: item.uuid,
            company_count: item.watchlist_companies?.length,
          };
        })
      );
    }
    if (userInfo?.id) fetchLatestWatchlistsData(userInfo.id);
  }, [userInfo?.id, isSearchBarOpen, watchlistCompanies]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsModalRef.current &&
        !optionsModalRef.current.contains(event.target as Node)
      ) {
        setIsOptionsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleSortCompaniesAlpha = () => {
    setIsComptortAlpha((prev) => !prev);
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
    <div className="flex justify-center p-4 h-full overflow-auto">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
          <h1>Loading</h1>
        </div>
      ) : (
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between relative pl-4 py-2 w-8/12">
            <h1 className="font-bold text-lg">{watchlistName}</h1>
            <div className="flex">
              <button
                className={
                  "rounded-full p-2 flex items-center gap-2 hover:text-primary-700 " +
                  (isCompSortAlpha ? "text-primary-500" : "text-gray-500")
                }
                onClick={handleSortCompaniesAlpha}
              >
                <FaSortAlphaDown />
                <p>Sort by Name</p>
              </button>
              {watchlistCompanies.length > 0 && (
                <button
                  className="rounded-full py-2 px-4 bg-primary-500 text-gray-100 flex items-center"
                  onClick={handleAddInvestments}
                >
                  <IoAddOutline className="text-xl" />
                  <p>Company</p>
                </button>
              )}
              {watchlist && watchlist[0] && paramID !== watchlist[0].uuid && (
                <button
                  onClick={toggleOptionsModal}
                  className="hover:bg-gray-100 rounded-full w-12 h-12 items-center justify-center gap-0.5 bg-white flex flex-col"
                >
                  <BsThreeDotsVertical />
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

          {watchlistCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[90%]">
              <p>Nothing in this watchlist yet</p>
              <p className="text-gray-500">
                Track investments you care about here
              </p>
              <button
                className="rounded-full p-2 text-primary-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={handleAddInvestments}
              >
                <IoAddOutline className="text-xl" />
                <p>Add companies</p>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 my-2">
              <div className="col-span-2 flex flex-col gap-4 pb-5">
                <WLIncomeStatement
                  watchlistCompanies={watchlistCompanies}
                  isCompSortAlpha={isCompSortAlpha}
                  onRemoveCompany={(wl_compId: number) =>
                    handleRemoveCompanyFromWatchlist(wl_compId)
                  }
                />

                {watchlistCompanies?.length > 0 && (
                  <>
                    <OpportunitiesSection
                      companyID={30321} // watchlistCompanies[0].id}
                      watchlistName={watchlistName}
                      year={2024}
                      quarter={1}
                    />
                    <MarketingSection
                      companyID={30321} // watchlistCompanies[0].id}
                      companyName={watchlistName}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="border border-gray-300 rounded-lg p-3">
                  <h2 className="text-base font-semibold border-b border-gray-300 pb-2 mb-2 text-gray-800">
                    Watchlist Highligths
                  </h2>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 p-2 border-b border-gray-300 last:border-b-0 rounded text-gray-700 transition-all duration-300 group hover:bg-primary-50 cursor-pointer">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 transition-all duration-300 group-hover:bg-white">
                        <MdContentPaste size={20} color="#004aad" />
                      </span>
                      Content
                    </div>
                    <div className="flex items-center gap-3 p-2 border-b border-gray-300 last:border-b-0 rounded text-gray-700 transition-all duration-300 group hover:bg-primary-50 cursor-pointer">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 transition-all duration-300 group-hover:bg-white">
                        <MdContentPaste size={20} color="#004aad" />
                      </span>
                      Content
                    </div>
                    <div className="flex items-center gap-3 p-2 border-b border-gray-300 last:border-b-0 rounded text-gray-700 transition-all duration-300 group hover:bg-primary-50 cursor-pointer">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 transition-all duration-300 group-hover:bg-white">
                        <MdContentPaste size={20} color="#004aad" />
                      </span>
                      Content
                    </div>
                  </div>
                </div>

                <EarningsCalendar
                  key={watchlistName}
                  companiesList={watchlistCompanies}
                />
                <div className="border border-gray-300 rounded-lg p-3">
                  <h2 className="text-base font-semibold border-b border-gray-300 pb-2 mb-2 text-gray-800">
                    Similar Company To Follow
                  </h2>
                  <div className="flex flex-col">
                    {[0, 1, 2].map(() => (
                      <div className="flex items-center justify-between p-2 border-b border-gray-300 last:border-b-0 text-gray-700">
                        <span>Content</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center py-1 px-3 rounded bg-primary-50 text-primary-500">
                            0.00%
                          </span>
                          <MdAddCircleOutline
                            size={22}
                            className="cursor-pointer text-gray-400 hover:text-gray-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {isSearchBarOpen && (
            <CompanySearchbar
              type={"watchlist"}
              isSearchBarOpen={isSearchBarOpen}
              setIsSearchBarOpen={setIsSearchBarOpen}
              setWatchlistCompanies={setWatchlistCompanies}
            />
          )}
          <WatchlistModal
            type={modalType}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      )}
    </div>
  );
}
