"use client";
import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/utils/supabaseClient";
import { orgInfoAtom, userInfoAtom, watchlistAtom } from "@/utils/atoms";

interface WatchlistModalProps {
  type: string; //  add | rename | delete
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const WatchlistModal = ({
  type = "add",
  isModalOpen,
  setIsModalOpen,
}: WatchlistModalProps) => {
  const userInfo = useAtomValue(userInfoAtom);
  const orgInfo = useAtomValue(orgInfoAtom);
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (inputRef.current && type !== "delete") {
        inputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      if (type === "add") {
        const { data, error } = await supabase
          .from("watchlists")
          .insert({
            name: inputValue,
            organization_id: orgInfo?.id,
            creator_id: userInfo?.id,
          })
          .select()
          .single();

        if (error) throw error;

        setWatchlist((prev) => {
          return [
            ...(prev ?? []),
            {
              id: data.id,
              name: data.name,
              organizationID: data.organization_id,
              creatorID: data.creator_id,
              uuid: data.uuid,
            },
          ];
        });

        router.push(`/app/watchlist/${data.uuid}`);
      } else if (type === "rename") {
        const { data, error } = await supabase
          .from("watchlists")
          .update({ name: inputValue })
          .eq("uuid", params.id)
          .select()
          .single();

        if (error) throw error;

        setWatchlist((prev) => {
          return (
            prev?.map((item) =>
              item.uuid === data.uuid ? { ...item, name: data.name } : item
            ) || null
          );
        });
      }
    } catch (error) {
      if (type === "add") {
        console.error("Failed to insert watchlist", error);
      } else if (type === "rename") {
        console.error("Failed to update watchlist", error);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const handleDeleteClick = async () => {
    try {
      const watchlistID = watchlist?.find(
        (item) => item.uuid === params.id
      )?.id;

      // Delete all related entries from watchlist_companies
      const { error: deleteCompaniesError } = await supabase
        .from("watchlist_companies")
        .delete()
        .eq("watchlist_id", watchlistID);

      if (deleteCompaniesError) throw deleteCompaniesError;

      // Now delete the watchlist itself
      const { error: deleteWatchlistError } = await supabase
        .from("watchlists")
        .delete()
        .eq("uuid", params.id);

      if (deleteWatchlistError) throw deleteWatchlistError;

      setWatchlist(
        (prev) => prev?.filter((item) => item.uuid !== params.id) || null
      );

      router.push(`/app/watchlist/${watchlist && watchlist[0]?.uuid}`);
    } catch (error) {
      console.error("Error deleting watchlist:", error);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white text-black space-y-8 min-w-96 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl">
              {(() => {
                switch (type) {
                  case "add":
                    return "Create a new list";

                  case "rename":
                    return "Rename list";

                  case "delete":
                    return "Delete this watchlist?";

                  default:
                    return "";
                }
              })()}
            </h2>

            {type !== "delete" ? (
              <input
                ref={inputRef}
                type="text"
                placeholder="List name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              <p className="text-gray-500">This list will be deleted.</p>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-800 rounded hover:bg-gray-100 transition-colors duration-200 w-24"
                disabled={isLoading}
              >
                Cancel
              </button>

              {type !== "delete" ? (
                <button
                  onClick={handleSaveClick}
                  disabled={!inputValue.trim() || isLoading}
                  className={`px-4 py-2 rounded transition-colors duration-200 w-24 flex items-center justify-center ${
                    inputValue.trim() && !isLoading
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-gray-300 text-white cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                  ) : (
                    "Save"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDeleteClick}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded transition-colors duration-200 w-24 flex items-center justify-center ${
                    isLoading
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                  ) : (
                    "Delete"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchlistModal;
