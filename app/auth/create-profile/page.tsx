"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthInput from "@/app/components/SignInput";
import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import { userInfoAtom, orgInfoAtom, watchlistAtom } from "@/utils/atoms";
import { useSetAtom } from "jotai";

export default function CreateProfile() {
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const setUserInfo = useSetAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchList = useSetAtom(watchlistAtom);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    website: "",
    companyOverview: "",
    productsServices: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    website: "",
    companyOverview: "",
    productsServices: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const {
      firstName,
      lastName,
      companyName,
      companyOverview,
      productsServices,
    } = formData;
    const isValid =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      companyName.trim() !== "" &&
      companyOverview.trim() !== "" &&
      productsServices.trim() !== "";

    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleCreateProfile = async () => {
    if (!isFormValid) {
      setErrors({
        firstName:
          formData.firstName.trim() === "" ? "First name is required" : "",
        lastName:
          formData.lastName.trim() === "" ? "Last name is required" : "",
        companyName:
          formData.companyName.trim() === "" ? "Company name is required" : "",
        website: "",
        companyOverview:
          formData.companyOverview.trim() === ""
            ? "Company overview is required"
            : "",
        productsServices:
          formData.productsServices.trim() === ""
            ? "Products & services are required"
            : "",
      });
      return;
    }

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const updateUserData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        onboarding_status: true,
      };

      const { data: userData, error: userError } = await supabase
        .from("users")
        .update(updateUserData)
        .eq("id", user.id)
        .select()
        .single();

      if (userError) throw userError;

      // Update userData after successful Supabase update

      setUserInfo({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        companyName: "",
      });

      const insertOrganizationData = {
        name: formData.companyName,
        website: formData.website,
        overview: formData.companyOverview,
        products: formData.productsServices,
        creator_id: userData.id,
      };

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert(insertOrganizationData)
        .select()
        .single();

      if (orgError) throw orgError;

      // Update orgData after successful Supabase insert

      setOrgInfo({
        id: orgData.id,
        name: orgData.name,
        website: orgData.website,
        overview: orgData.overview,
        products: orgData.products,
        creatorID: userData.id,
      });

      const insertWatchlistData = {
        name: "Watchlist",
        organization_id: orgData.id,
        creator_id: userData.id,
      };

      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlists")
        .insert(insertWatchlistData)
        .select()
        .single();

      if (watchlistError) throw watchlistError;

      // Update watchlist after successful Supabase insert
      setWatchList([
        {
          id: watchlistData.id,
          name: watchlistData.name,
          organizationID: watchlistData.organization_id,
          creatorID: watchlistData.creator_id,
          uuid: watchlistData.uuid,
        },
      ]);

      invokeToast("success", "Profile created successfully!");
      router.replace(`/app/watchlist/${watchlistData.uuid}`);
    } catch (error) {
      console.error("Error creating profile:", error);
      invokeToast("error", "Failed to create profile. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="flex flex-col lg:flex-row justify-center h-full">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            <div className="md:w-[30rem] w-full shadow-slate-200 rounded-xl md:shadow-2xl md:p-8">
              <header className="text-center mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold mb-2">
                  Create Your Profile
                </h2>
              </header>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <div className="space-y-1 w-full">
                    <p className="text-slate-600">First Name*</p>
                    <AuthInput
                      error={errors.firstName}
                      type="text"
                      onChange={(e: any) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <p className="text-slate-600">Last Name*</p>
                    <AuthInput
                      error={errors.lastName}
                      type="text"
                      onChange={(e: any) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600">Company Name*</p>
                  <AuthInput
                    error={errors.companyName}
                    type="text"
                    onChange={(e: any) =>
                      handleInputChange("companyName", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600">Website</p>
                  <AuthInput
                    error={errors.website}
                    type="url"
                    onChange={(e: any) =>
                      handleInputChange("website", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600">Company Overview*</p>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    onChange={(e: any) =>
                      handleInputChange("companyOverview", e.target.value)
                    }
                  ></textarea>
                  {errors.companyOverview && (
                    <p className="text-red-500 text-sm">
                      {errors.companyOverview}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600">Products & Services*</p>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    onChange={(e: any) =>
                      handleInputChange("productsServices", e.target.value)
                    }
                  ></textarea>
                  {errors.productsServices && (
                    <p className="text-red-500 text-sm">
                      {errors.productsServices}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCreateProfile}
                  disabled={isLoading || !isFormValid}
                  className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
                  ) : (
                    "Create Profile"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
