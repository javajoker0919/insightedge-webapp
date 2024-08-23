"use client";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { orgInfoAtom } from "@/utils/atoms";
import { Loading } from "@/app/components";
import { useToastContext } from "@/contexts/toastContext";

const CompanyProfile = () => {
  const [orgInfo, setOrgInfo] = useAtom(orgInfoAtom);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [overview, setOverview] = useState("");
  const [products, setProducts] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { invokeToast } = useToastContext();

  useEffect(() => {
    if (orgInfo) {
      setName(orgInfo.name || "");
      setWebsite(orgInfo.website || "");
      setOverview(orgInfo.overview || "");
      setProducts(orgInfo.products || "");
    }
  }, [orgInfo]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("organizations")
      .update({
        name,
        website,
        overview,
        products,
      })
      .eq("id", orgInfo?.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      invokeToast("success", "Profile updated successfully");
      setOrgInfo((prev) => ({
        ...prev,
        name,
        website,
        overview,
        products,
        id: prev?.id || 0, // Ensure id is always a number
        creatorID: prev?.creatorID || "", // Ensure creatorID is always a string
      }));
    }
    setIsUpdating(false);
  };

  if (!orgInfo) {
    return (
      <div className="m-auto p-10 w-[60rem] bg-white flex justify-center items-center">
        <Loading size={10} color="primary" />
      </div>
    );
  }

  return (
    <div className="m-auto p-10 w-[70rem] bg-white">
      <h1 className="text-2xl font-bold mb-10 text-center">Company Profile</h1>
      <div className="text-lg space-y-8">
        <div>
          <strong>Name:</strong>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 rounded w-full"
          />
        </div>
        <div>
          <strong>Website:</strong>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 rounded w-full"
          />
        </div>
        <div>
          <strong>Overview:</strong>
          <textarea
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 h-60 rounded w-full"
          />
        </div>
        <div>
          <strong>Products and Services:</strong>
          <textarea
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 h-60 rounded w-full"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleUpdateProfile}
            className={`w-40 py-2 flex items-center justify-center h-12 bg-blue-500 text-white rounded ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? <Loading size={5} color="white" /> : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
