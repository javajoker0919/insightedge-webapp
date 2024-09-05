import { useState, useRef, useEffect, useCallback } from "react";
import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import Link from "next/link";

import { watchlistAtom } from "@/utils/atoms";
import { PlusSvg, CheckSvg } from ".";
import { supabase } from "@/utils/supabaseClient";
import WatchlistModal from "@/app/components/WatchlistModal";
import { getMixPanelClient } from "@/utils/mixpanel";

interface WatchlistItem {
  id: number;
  uuid: string;
  name: string;
}

const FollowButton: React.FC = () => {
  const { id: companyID } = useParams<{ id: string }>();
  const mixpanel = getMixPanelClient();

  const watchlist = useAtomValue(watchlistAtom);
  const [checkedWatchlists, setCheckedWatchlists] =
    useState<Set<number> | null>(null);
  const [isWatchlistDropdownOpen, setIsWatchlistDropdownOpen] =
    useState<boolean>(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] =
    useState<boolean>(false);
  const watchlistRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      watchlistRef.current &&
      !watchlistRef.current.contains(event.target as Node)
    ) {
      setIsWatchlistDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlists();
  }, [companyID, watchlist]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const fetchWatchlists = useCallback(async () => {
    if (!(!!companyID && !!watchlist)) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("watchlist_companies")
        .select("watchlist_id")
        .eq("company_id", companyID);

      if (error) throw error;

      const watchlistIDList = watchlist.map((item) => item.id);
      const dataIDlist = data.map((item) => item.watchlist_id);
      const filteredDataIDList = dataIDlist.filter((id) =>
        watchlistIDList.includes(id)
      );

      setCheckedWatchlists(new Set(filteredDataIDList));
    } catch (error) {
      console.error("Error fetching watchlists:", error);
    }
  }, [companyID, watchlist]);

  const handleFollowClick = useCallback(async () => {
    if (checkedWatchlists === null) {
      await fetchWatchlists();
    }
    setIsWatchlistDropdownOpen((prev) => !prev);
  }, [fetchWatchlists, checkedWatchlists]);

  const handleWatchlistItemClick = async (id: number) => {
    try {
      setCheckedWatchlists((prev) => {
        if (!prev) return prev;
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });

      if (checkedWatchlists?.has(id)) {
        mixpanel.track("company.remove", {
          $source: "company_page.follow_button",
        });

        await supabase
          .from("watchlist_companies")
          .delete()
          .eq("watchlist_id", id)
          .eq("company_id", companyID);
        mixpanel.track("Unfollow Company", { companyID }); // Track unfollow event
      } else {
        mixpanel.track("company.add", {
          $source: "company_page.follow_button",
        });

        await supabase.from("watchlist_companies").insert({
          watchlist_id: id,
          company_id: companyID,
        });
        mixpanel.track("Follow Company", { companyID }); // Track follow event
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  return (
    <div className="relative" ref={watchlistRef}>
      <button
        className={`px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 shadow-sm rounded-full hover:bg-gray-100 focus:outline-none flex items-center ${
          checkedWatchlists !== null && checkedWatchlists.size > 0
            ? "bg-blue-100"
            : "bg-white"
        }`}
        onClick={handleFollowClick}
      >
        {checkedWatchlists !== null && checkedWatchlists.size > 0 ? (
          <div className="items-center flex justify-center gap-1">
            <CheckSvg />
            Following
          </div>
        ) : (
          <div className="items-center flex justify-center gap-1">
            <PlusSvg />
            Follow
          </div>
        )}
      </button>
      {isWatchlistDropdownOpen && (
        <div
          className={`absolute right-0 border mt-2 w-64 rounded-md shadow-lg z-10 bg-white`}
        >
          <div className="py-2">
            {watchlist?.map((item: WatchlistItem) => (
              <div
                key={item.uuid}
                className="flex items-center justify-between px-4 py-2.5 gap-2 text-sm text-gray-700 hover:bg-gray-100 group cursor-pointer"
                onClick={() => handleWatchlistItemClick(item.id)}
              >
                <div className="flex w-40 flex-1 items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={checkedWatchlists?.has(item.id) || false}
                    readOnly
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <Link
                  href={`/app/watchlist/${item.uuid}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="opacity-0 w-fit shrink-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700"
                >
                  Open
                </Link>
              </div>
            ))}
          </div>

          <hr></hr>

          <button
            onClick={() => {
              setIsWatchlistDropdownOpen(false);
              setIsWatchlistModalOpen(true);

              mixpanel.track("watchlist.create", {
                $source: "company_page.follow_button",
              });
            }}
            className="py-2.5 flex items-center gap-1 px-3.5 text-gray-700 hover:bg-gray-100 w-full"
          >
            <PlusSvg />
            New watchlist
          </button>
        </div>
      )}

      <WatchlistModal
        type="add"
        isModalOpen={isWatchlistModalOpen}
        setIsModalOpen={setIsWatchlistModalOpen}
      />
    </div>
  );
};

export default FollowButton;
