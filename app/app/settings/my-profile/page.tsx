"use client";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { supabase } from "@/utils/supabaseClient";
import { userInfoAtom } from "@/utils/atoms";
import { Loading } from "@/app/components";
import { useToastContext } from "@/contexts/toastContext";

const MyProfile = () => {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { invokeToast } = useToastContext();

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
    }
  }, [userInfo]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const { error } = await supabase
      .from("users")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", userInfo?.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      invokeToast("success", "Profile updated successfully");
      setUserInfo((prev) => ({
        ...prev,
        firstName,
        lastName,
        id: prev?.id || "", // Ensure id is always a string
        email: prev?.email || "", // Ensure email is always a string
        companyName: prev?.companyName || "", // Ensure companyName is always a string
        creditCount: prev?.creditCount ?? 0, // Ensure creditCount is always number or null
      }));
    }
    setIsUpdating(false);
  };

  if (!userInfo) {
    return (
      <div className="m-auto p-10 w-[60rem] bg-white flex justify-center items-center">
        <Loading size={10} color="primary" />
      </div>
    );
  }

  return (
    <div className="m-auto p-10 w-[60rem] bg-white">
      <h1 className="text-2xl font-bold mb-10 text-center">My Profile</h1>
      <div className="text-lg space-y-8">
        <div>
          <strong>Email:</strong>
          <div className="p-2 border bg-gray-50 mt-1 rounded">
            {userInfo?.email}
          </div>
        </div>
        <div>
          <strong>First Name:</strong>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 rounded w-full"
          />
        </div>
        <div>
          <strong>Last Name:</strong>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 border bg-gray-50 mt-1 rounded w-full"
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

export default MyProfile;
