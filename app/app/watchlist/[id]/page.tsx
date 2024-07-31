"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { IoAddOutline, IoPencil, IoTrash, IoClose } from "react-icons/io5";

import { supabase } from "@/utils/supabaseClient";
import { userInfoAtom, watchlistAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";
import CompanySearchbar from "@/app/components/CompanySearchbar";

import { LuCalendarPlus } from "react-icons/lu";
import { MdAddCircleOutline, MdContentPaste } from "react-icons/md";
import { FaSortAlphaDown } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

import OpportunitiesSection from "./Opportunities/OpportunitiesSection";
import MarketingSection from "../../company/[id]/Marketing/MarketingSection";

const sortAlphabetically = (arr: Array<{ name: string }>) =>
  [...arr].sort((elA, elB) => {
    const nameA = elA.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const nameB = elB.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const numberPattern = /^\d+/;
    const numA = nameA.match(numberPattern);
    const numB = nameB.match(numberPattern);

    if (numA && numB) {
      const numComparison = parseInt(numA[0], 10) - parseInt(numB[0], 10);
      if (numComparison !== 0) return numComparison;
    }

    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });

const randomColor = [
  "bg-fuchsia-800",
  "bg-teal-800",
  "bg-gray-800",
  "bg-red-800",
  "bg-blue-800",
  "bg-green-800",
  "bg-purple-800",
];

export default function WatchlistPage() {
  const params = useParams();
  const paramID = params.id as string;

  const router = useRouter();

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
                <div className="flex flex-col">
                  {(isCompSortAlpha
                    ? sortAlphabetically(watchlistCompanies)
                    : watchlistCompanies
                  ).map((company, indx) => {
                    const symbolClass = `${
                      randomColor[indx % randomColor.length]
                    } text-white text-xs p-1`;
                    const randomValues = [
                      {
                        value: Math.round(Math.random() * (120 - 20) + 20),
                        percentage: (Math.random() * (25 - 5.1) + 5.1).toFixed(
                          1
                        ),
                      },
                      {
                        value: Math.round(Math.random() * (120 - 50) + 50),
                        percentage: (Math.random() * (25 - 5.1) + 5.1).toFixed(
                          1
                        ),
                      },
                      {
                        value: Math.round(Math.random() * (100 - 25) + 25),
                        percentage: (Math.random() * (25 - 5.1) + 5.1).toFixed(
                          1
                        ),
                      },
                    ];
                    return (
                      <div
                        key={company.id}
                        onClick={() =>
                          router.push(`/app/company/${company.id}`)
                        }
                        className="py-2 hover:cursor-pointer px-4 hover:bg-primary-50 border-t last:border-b-0 flex justify-between items-center group"
                      >
                        <div className="flex gap-2 items-center w-3/6">
                          <p className={symbolClass}>{company.symbol}</p>
                          <p className="font-medium text-sm">{company.name}</p>
                        </div>
                        <span
                          title="Revenue/ Rev Growth"
                          className="text-sm flex items-center justify-end w-1/6"
                        >
                          ${randomValues[0].value}
                          {Number(randomValues[0].percentage) > 7.5 ? (
                            <>
                              <MdArrowUpward className="text-green-700" />
                              <p className="text-xs text-green-700">
                                ({randomValues[0].percentage})%
                              </p>
                            </>
                          ) : (
                            <>
                              <MdArrowDownward className="text-red-700" />
                              <p className="text-xs text-red-700">
                                ({randomValues[0].percentage})%
                              </p>
                            </>
                          )}
                        </span>
                        <span
                          title="Income/ Inc Growth"
                          className="text-sm flex items-center justify-end w-1/6"
                        >
                          ${randomValues[1].value}
                          {Number(randomValues[1].percentage) > 12.5 ? (
                            <>
                              <MdArrowUpward className="text-green-700" />
                              <p className="text-xs text-green-700">
                                ({randomValues[1].percentage})%
                              </p>
                            </>
                          ) : (
                            <>
                              <MdArrowDownward className="text-red-700" />
                              <p className="text-xs text-red-700">
                                ({randomValues[1].percentage})%
                              </p>
                            </>
                          )}
                        </span>
                        <span
                          title="Expense/ Exp Growth"
                          className="text-sm flex items-center justify-end w-1/6"
                        >
                          ${randomValues[2].value}
                          {Number(randomValues[2].percentage) > 20 ? (
                            <>
                              <MdArrowUpward className="text-green-700" />
                              <p className="text-xs text-green-700">
                                ({randomValues[2].percentage})%
                              </p>
                            </>
                          ) : (
                            <>
                              <MdArrowDownward className="text-red-700" />
                              <p className="text-xs text-red-700">
                                ({randomValues[2].percentage})%
                              </p>
                            </>
                          )}
                        </span>
                        <button
                          onClick={(e) => {
                            handleRemoveCompanyFromWatchlist(
                              company.watchlist_company_id
                            );
                            e.stopPropagation();
                          }}
                          className="text-white hover:bg-gray-200 p-0.5 rounded-full group-hover:text-gray-500"
                        >
                          <IoClose className="text-lg" />
                        </button>
                      </div>
                    );
                  })}
                </div>

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
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="mb-2">
                    <h2 className="text-base font-semibold text-gray-800">
                      Earnings Calendar
                    </h2>
                    <h5 className="text-xs font-semibold text-gray-400">
                      Based on your watchlist
                    </h5>
                  </div>

                  <div className="flex flex-col">
                    {[
                      {
                        eventName: "Abb Vie",
                        eventDate: "jul 25, 2024 09:30 AM",
                      },
                      { eventName: "Merck Sharp", eventDate: "jul 30, 2024" },
                    ].map(({ eventName, eventDate }) => {
                      const [month, date] = eventDate.split(", ")[0].split(" ");
                      return (
                        <div
                          key={`event-${eventDate}`}
                          className="flex items-center p-2 justify-between border-t border-gray-300 pb-2 mb-2 last:mb-0 "
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex w-12 flex-col items-center bg-primary-50 text-primary-500 py-1 px-2 rounded">
                              <span className="text-xs uppercase">{month}</span>
                              <span className="text-xl font-semibold">
                                {date}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <h6 className="text-base text-gray-700 font-semibold">
                                {eventName}
                              </h6>
                              <span className="text-sm text-gray-500 capitalize">
                                {eventDate}
                              </span>
                            </div>
                          </div>
                          <LuCalendarPlus
                            size={25}
                            className="cursor-pointer text-gray-500 hover:text-primary-500 transition-all duration-300"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
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
