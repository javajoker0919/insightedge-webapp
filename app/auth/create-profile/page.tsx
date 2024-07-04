"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import AuthInput from "@/app/components/SignInput";
import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";

export default function CreateProfile() {
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
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
            ? "Products & Services is required"
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

      const { error } = await supabase
        .from("users")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: formData.companyName,
          website: formData.website,
          company_overview: formData.companyOverview,
          products_and_services: formData.productsServices,
          auth_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      invokeToast("success", "Profile created successfully!", "top");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error creating profile:", error);
      invokeToast(
        "error",
        "Failed to create profile. Please try again.",
        "top"
      );
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
