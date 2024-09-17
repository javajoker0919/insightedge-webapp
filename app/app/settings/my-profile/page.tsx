"use client";
import { useState, useEffect } from "react";

import { supabase } from "@/utils/supabaseClient";
import { Loading } from "@/app/components";
import { useToastContext } from "@/contexts/toastContext";

const MyProfile = () => {
  const { invokeToast } = useToastContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsFetching(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, email")
          .eq("id", user.id)
          .single();

        if (error) {
          invokeToast(
            "error",
            `Failed to fetch user profile: ${error.message}`
          );
          console.error("Failed to fetch user profile:", error);
        } else {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setEmail(data.email || "");
        }
      }
    } catch (error) {
      invokeToast("error", `Failed to fetch user profile: ${error}`);
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("users")
          .update({ first_name: firstName, last_name: lastName })
          .eq("id", user.id);

        if (error) {
          invokeToast("error", `Failed to update profile: ${error.message}`);
          console.error("Failed to update profile: ", error);
        } else {
          invokeToast("success", "Profile updated successfully");
        }
      }
    } catch (error) {
      invokeToast("error", `Failed to update profile: ${error}`);
      console.error(`Failed to update profile: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFetching) {
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
          <div className="p-2 border bg-gray-50 mt-1 rounded">{email}</div>
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
