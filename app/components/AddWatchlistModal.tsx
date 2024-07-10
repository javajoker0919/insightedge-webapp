import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { orgInfoAtom, userInfoAtom, watchlistAtom } from "@/utils/atoms";

const AddWatchlistModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const userInfo = useAtomValue(userInfoAtom);
  const orgInfo = useAtomValue(orgInfoAtom);
  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setInputValue("");
  };

  const handleAddWatchlist = async () => {
    setIsSaving(true);
    try {
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
    } catch (error) {
      console.error("Failed to insert to waitlist", error);
    } finally {
      setIsSaving(false);
      closeModal();
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
            <h2 className="text-2xl">Create a new list</h2>
            <input
              type="text"
              placeholder="List name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-800 rounded hover:bg-gray-100 transition-colors duration-200 w-24"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleAddWatchlist}
                disabled={!inputValue.trim() || isSaving}
                className={`px-4 py-2 rounded transition-colors duration-200 w-24 flex items-center justify-center ${
                  inputValue.trim() && !isSaving
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-white cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddWatchlistModal;
