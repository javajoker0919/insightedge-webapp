"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";

import { IoAddOutline, IoPencil, IoTrash } from "react-icons/io5";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import { watchlistAtom } from "@/utils/atoms";

import {
  WLOpportunitySection,
  WLMarketingSection,
  WLCalendarSection,
  WLIncomeStatementSection,
  WLHighlightSection,
  WLSimilarCompanySection,
  Loading,
  WLCompanySearchbar,
  WatchlistModal,
} from "@/app/components";

import { HighlightProps } from "@/app/components/watchlist/WLHighlightSection";
import { CalendarProps } from "@/app/components/watchlist/WLCalendarSection";
import { IncomeStatementProps } from "@/app/components/watchlist/WLIncomeStatementSection";
import { getMixPanelClient } from "@/utils/mixpanel";

export interface CompanyProps {
  id: number;
  name: string;
  symbol: string;
  industry: string;
}

interface WatchlistProps {
  id: number;
  name: string;
}

interface EarningsTranscriptProps {
  etID: number;
  companyID: number;
}

const WatchlistPage = () => {
  const params = useParams();
  const paramID = params.id as string;
  const { invokeToast } = useToastContext();
  const mixpanel = getMixPanelClient();

  const [watchlist, setWatchlist] = useAtom(watchlistAtom);

  const [watchlistInfo, setWatchlistInfo] = useState<WatchlistProps | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"add" | "rename" | "delete">(
    "add"
  );
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false);
  const optionsModalRef = useRef<HTMLDivElement>(null);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(true);

  const [watchlistCompanies, setWatchlistCompanies] = useState<
    CompanyProps[] | []
  >([]);

  const [isFetchingWLCs, setIsFetchingWLCs] = useState<boolean>(false);
  const [isAddingCompany, setIsAddingCompany] = useState<boolean>(false);

  const [WLCompanies, setWLCompanies] = useState<CompanyProps[] | []>([]);
  const [ISs, setISs] = useState<IncomeStatementProps[]>([]);
  const [highlights, setHighlights] = useState<HighlightProps[]>([]);
  const [calendars, setCalendars] = useState<CalendarProps[]>([]);
  const [etIDs, setETIDs] = useState<number[]>([]);
  const [ETs, setETs] = useState<EarningsTranscriptProps[]>([]);

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

  useEffect(() => {
    if (paramID) {
      fetchWatchlistCompanies(paramID);
    }
  }, [paramID]);

  useEffect(() => {
    if (paramID && watchlist && watchlist.length > 0) {
      const watchlistItem =
        watchlist.find((item) => item.uuid === paramID) ?? null;

      if (watchlistItem) {
        setWatchlistInfo({
          id: watchlistItem.id,
          name: watchlistItem.name,
        });
      }
    }
  }, [paramID, watchlist]);

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
    mixpanel.track("company.add", {
      $source: "watchlist_page.plus_company",
    });

    setIsSearchBarOpen(true);
  };

  const handleSortCompanies = () => {
    setIsSorted((prev) => !prev);
  };

  const fetchWatchlistCompanies = async (watchlistUUID: string) => {
    setIsFetchingWLCs(true);

    const tempWLCompanies: CompanyProps[] = [];
    const tempETIDs: number[] = [];
    const tempETs: EarningsTranscriptProps[] = [];
    const tempISs: IncomeStatementProps[] = [];
    const tempHLs: HighlightProps[] = [];
    const tempECs: CalendarProps[] = [];

    try {
      const { data, error } = await supabase
        .from("watchlist_companies_with_all_view_v3")
        .select(
          `
          company_id,
          company_industry,
          company_name,
          company_revrank,
          company_symbol,
          earnings_calendar_date,
          income_statement_filling_date,
          income_statement_net_income,
          income_statement_net_income_yoy_growth,
          income_statement_period,
          income_statement_revenue,
          income_statement_revenue_yoy_growth,
          keyhighlight,
          latest_earnings_transcript_id,
          organization_id,
          watchlist_creator_id,
          watchlist_id,
          watchlist_name
          `
        )
        .eq("watchlist_uuid", watchlistUUID);

      if (error) {
        invokeToast(
          "error",
          `Failed to fetch watchlist companies: ${error.message}`
        );
        throw error;
      }

      if (data.length > 0) {
        data.map((item) => {
          /// set watchlist companies
          tempWLCompanies.push({
            id: item.company_id,
            name: item.company_name,
            symbol: item.company_symbol,
            industry: item.company_industry,
          });

          /// set earnings transcript IDs
          if (item.latest_earnings_transcript_id) {
            tempETIDs.push(item.latest_earnings_transcript_id);
            tempETs.push({
              etID: item.latest_earnings_transcript_id,
              companyID: item.company_id,
            });
          }

          /// set income statements
          tempISs.push({
            companyID: item.company_id,
            companySymbol: item.company_symbol,
            companyName: item.company_name,
            revenue: item.income_statement_revenue,
            revenueYoyGrowth: item.income_statement_revenue_yoy_growth,
            netIncome: item.income_statement_net_income,
            netIncomeYoyGrowth: item.income_statement_net_income_yoy_growth,
            fillingDate: item.income_statement_filling_date,
            period: item.income_statement_period,
          });

          /// set highlights
          if (item.keyhighlight) {
            tempHLs.push({
              companyID: item.company_id,
              companyName: item.company_name,
              highlight: item.keyhighlight,
            });
          }

          /// set earnings calendar
          if (item.earnings_calendar_date) {
            tempECs.push({
              companyID: item.company_id,
              companyName: item.company_name,
              date: item.earnings_calendar_date,
            });
          }
        });

        if (tempWLCompanies.length > 0) setWLCompanies(tempWLCompanies);
        if (tempETIDs.length > 0) setETIDs(tempETIDs);
        if (tempETs.length > 0) setETs(tempETs);
        if (tempISs.length > 0) setISs(tempISs);
        if (tempHLs.length > 0) setHighlights(tempHLs);
        if (tempECs.length > 0) setCalendars(tempECs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingWLCs(false);
      setIsAddingCompany(false);
    }
  };

  const handleAddCompanyToWatchlist = async (companyID: number) => {
    if (watchlistInfo === null || watchlistInfo.id === null) {
      return;
    }

    setIsAddingCompany(true);

    try {
      const { data, error } = await supabase
        .from("watchlist_companies")
        .insert({
          watchlist_id: watchlistInfo?.id,
          company_id: companyID,
        })
        .select();

      if (error) {
        invokeToast(
          "error",
          `Failed to add company to watchlist: ${error.message}`
        );
        setIsAddingCompany(false);

        throw error;
      }

      if (data) {
        invokeToast(
          "success",
          "Company has been added to watchlist successfully"
        );
        fetchWatchlistCompanies(paramID);

        /**
         * if company is added to watchlist successfully,
         * update company count of watchlist in local storage
         */
        setWatchlist((prev) => {
          if (!prev) return null;

          return prev.map((item) => {
            if (item.uuid === paramID && item.company_count) {
              return {
                ...item,
                company_count: item.company_count + 1,
              };
            }

            return item;
          });
        });
      } else {
        setIsAddingCompany(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCompanyFromWatchlist = async (companyID: number) => {
    if (watchlistInfo === null || watchlistInfo.id === null) {
      return;
    }

    setWLCompanies((prev) => prev.filter((item) => item.id !== companyID));
    setISs((prev) => prev.filter((item) => item.companyID !== companyID));
    setHighlights((prev) =>
      prev.filter((item) => item.companyID !== companyID)
    );
    setCalendars((prev) => prev.filter((item) => item.companyID !== companyID));

    const etItem = ETs.find((item) => item.companyID === companyID);
    setETIDs((prev) => prev.filter((item) => item !== etItem?.etID));

    try {
      const { data, error } = await supabase
        .from("watchlist_companies")
        .delete()
        .eq("watchlist_id", watchlistInfo.id)
        .eq("company_id", companyID)
        .select();

      if (error) {
        invokeToast(
          "error",
          `Failed to remove company from watchlist: ${error.message}`
        );
        throw error;
      }

      if (data) {
        invokeToast(
          "success",
          "Company has been removed from watchlist successfully"
        );

        /**
         * if company is added to watchlist successfully,
         * update company count of watchlist in local storage
         */
        setWatchlist((prev) => {
          if (!prev) return null;

          return prev.map((item) => {
            if (item.uuid === paramID && item.company_count) {
              return {
                ...item,
                company_count: item.company_count - 1,
              };
            }

            return item;
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center p-4 h-full overflow-auto">
      {isFetchingWLCs && !isAddingCompany ? (
        <div className="flex flex-col items-center m-auto gap-4">
          <Loading />
          <h1>Loading</h1>
        </div>
      ) : (
        <div className="relative w-full">
          <div className="flex flex-col sm:flex-row w-full items-center gap-4 mb-4">
            <div className="flex items-center justify-between w-full sm:w-auto flex-grow relative pl-4 py-2">
              <h1 className="font-bold text-lg">{watchlistInfo?.name}</h1>
              <div className="flex-grow"></div>
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <button
                  onClick={handleSortCompanies}
                  className={`rounded-full p-2 flex items-center gap-2 hover:text-primary-700 ${
                    isSorted ? "text-primary-500" : "text-gray-500"
                  }`}
                >
                  {isSorted ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                  <span className="hidden sm:inline">Sort by Name</span>
                </button>

                {WLCompanies.length > 0 && (
                  <button
                    className="rounded-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-gray-100 flex items-center"
                    onClick={handleAddInvestments}
                  >
                    <IoAddOutline className="text-xl" />
                    <span className="hidden sm:inline">Company</span>
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
                  className="absolute w-52 py-1 border border-gray-100 right-4 top-14 bg-white shadow-md rounded-md overflow-hidden z-10"
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
              {isSearchBarOpen && (
                <div className="flex justify-end">
                  <WLCompanySearchbar
                    isSearchBarOpen={isSearchBarOpen}
                    setIsSearchBarOpen={setIsSearchBarOpen}
                    handleAddCompanyToWatchlist={handleAddCompanyToWatchlist}
                  />
                </div>
              )}
            </div>
            <div className="lg:w-[20rem] xl:w-[25rem] shrink-0"></div>
          </div>

          {WLCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[90%] text-center">
              <p>Nothing in this watchlist yet</p>
              <p className="text-gray-500 mt-2">
                Track investments you care about here
              </p>
              <button
                className="rounded-full p-2 mt-4 text-primary-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={handleAddInvestments}
              >
                <IoAddOutline className="text-xl" />
                <p>Add companies</p>
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-start w-full gap-4 my-2">
              <div className="flex-grow flex flex-col gap-4 pb-5 w-full">
                <WLIncomeStatementSection
                  incomeStatements={ISs}
                  handleRemoveCompanyFromWatchlist={
                    handleRemoveCompanyFromWatchlist
                  }
                  isSorted={isSorted}
                  isLoading={isFetchingWLCs}
                />
                <WLOpportunitySection
                  etIDs={etIDs}
                  isLoading={isFetchingWLCs}
                />
                <WLMarketingSection etIDs={etIDs} isLoading={isFetchingWLCs} />
              </div>
              <div className="w-full lg:w-[20rem] xl:w-[25rem] h-full flex flex-col space-y-4 shrink-0">
                <WLHighlightSection
                  highlights={highlights}
                  isLoading={isFetchingWLCs}
                />
                <WLCalendarSection
                  calendars={calendars}
                  isLoading={isFetchingWLCs}
                />
                <WLSimilarCompanySection
                  watchlistCompanies={WLCompanies}
                  handleAddCompanyToWatchlist={handleAddCompanyToWatchlist}
                  isLoading={isFetchingWLCs}
                />
              </div>
            </div>
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
};

export default WatchlistPage;
