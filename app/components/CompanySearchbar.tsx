"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import { addNewPrivateCompany } from "@/utils/apiClient";
import { Modal, Loading } from "@/app/components";

const CompanySearchbar: React.FC = () => {
  const router = useRouter();

  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    if (searchInput) {
      setSearchInput("");
    } else {
      setIsInputFocused(false);
    }
  };

  const handleCompanyClick = (companyID: number) => {
    setIsInputFocused(false);
    router.push(`/app/company/${companyID}`);
  };

  return (
    <div
      id="search-bar"
      ref={searchBarRef}
      className="absolute w-full max-w-[750px] flex justify-center"
    >
      <div
        className={`${
          isInputFocused ? "shadow-2xl" : ""
        } w-full border overflow-hidden bg-white border-gray-100 relative rounded-md`}
      >
        {isInputFocused && (
          <div className="absolute top-1 right-1 flex items-center">
            {isSearching && (
              <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500 mr-2" />
            )}
            <button
              onClick={handleCloseSearchBar}
              className="hover:bg-gray-200 rounded-full p-1"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        )}

        <input
          ref={searchInputRef}
          className={`w-full rounded-md focus:outline-none ${
            isInputFocused ? "" : "bg-gray-100"
          } py-2 px-3`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for companies..."
          onFocus={() => setIsInputFocused(true)}
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
              {searchResults.length > 0 ? (
                searchResults.map((company) => (
                  <div
                    key={company.id}
                    className="py-2 px-5 bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex justify-between items-center"
                    onClick={() => handleCompanyClick(company.id)}
                  >
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-gray-500 text-sm">{company.symbol}</p>
                    </div>
                    <p className="text-gray-500 text-sm rounded-full py-1 px-3 bg-yellow-50 border-yellow-200 border">
                      {company.industry}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="p-4 bg-white transition-colors duration-200 flex justify-center items-center"
                  onClick={() => {}}
                >
                  <span className="text-gray-500">
                    There is no such company. Do you want to{" "}
                    <span
                      onClick={() => {
                        setIsInputFocused(false);
                        setIsModalOpen(true);
                      }}
                      className="text-primary-400 font-semibold cursor-pointer"
                    >
                      add it now?
                    </span>
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AddNewCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CompanySearchbar;

interface AddNewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNewCompanyModal: React.FC<AddNewCompanyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { invokeToast } = useToastContext();

  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await addNewPrivateCompany({
        company_name: companyName,
      });

      if (status === 200) {
        invokeToast("success", data.message);
        onClose();
        setCompanyName("");
      } else {
        invokeToast("error", "Failed to add company");
      }
    } catch (error) {
      invokeToast("error", `Failed to add company: ${error}`);
      console.error(`Failed to add company: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setCompanyName("");
      }}
    >
      <div className="p-4">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          className="border p-2 rounded w-full mb-4"
          disabled={isLoading}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAdd}
            className="bg-primary-600 text-white py-2 px-4 rounded flex items-center justify-center w-20 disabled:cursor-not-allowed disabled:bg-primary-400"
            disabled={isLoading}
          >
            {isLoading ? <Loading color="white" size={5} /> : <span>Add</span>}
          </button>
          <button
            onClick={() => {
              onClose();
              setCompanyName("");
            }}
            className="bg-gray-300 text-black py-2 px-4 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
