"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import HeaderImage from "@/app/components/HeaderImage";
import { supabase } from "@/utils/supabaseClient";
import { useSetAtom } from "jotai";
import { userInfoAtom } from "@/utils/atoms";
import { createCustomer } from "@/utils/apiClient";

const UserInfo = () => {
  const router = useRouter();

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: ""
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: ""
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setUserInfo = useSetAtom(userInfoAtom);

  useEffect(() => {
    const { firstName, lastName, companyName, industry } = formData;
    const isValid =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      companyName.trim() !== "" &&
      industry.trim() !== "";

    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleCreateUserInfo = async () => {
    
    if (!isFormValid) {
      setErrors({
        firstName:
          formData.firstName.trim() === "" ? "First name is required" : "",
        lastName:
          formData.lastName.trim() === "" ? "Last name is required" : "",
        companyName:
          formData.companyName.trim() === "" ? "Company name is required" : "",
        industry: formData.industry.trim() === "" ? "Industry is required" : ""
      });
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({
          id: localStorage.getItem("userId"),
          email: localStorage.getItem("email"),
          first_name: formData.firstName,
          last_name: formData.lastName,
          onboarding_status: true
        })
        .select()
        .single();

      if (userError) throw userError;

      createCustomer();

      setUserInfo({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        companyName: formData.companyName,
        onboardingStatus: false
      });

      router.replace(`/onboarding/company-profile`);
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row w-full h-screen">
        <div className="flex flex-col items-center justify-center w-1/2 h-full z-10 px-12">
          <HeaderImage />
          <div className="flex flex-col w-full">
            <h1 className="text-3xl font-bold leading-tight my-16">
              Tell Us About Yourself
            </h1>
            <form className="flex flex-col gap-6 mx-6">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="text-lg font-bold leading-7"
                >
                  First Name*
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e: any) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-lg font-bold leading-7"
                >
                  Last Name*
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e: any) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="companyName"
                  className="text-lg font-bold leading-7"
                >
                  Company Name*
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e: any) =>
                    handleInputChange("companyName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="industry"
                  className="text-lg font-bold leading-7"
                >
                  Industry*
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e: any) =>
                    handleInputChange("industry", e.target.value)
                  }
                />
              </div>
            </form>
            <div className="flex justify-between mt-10 w-full px-6">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                disabled
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleCreateUserInfo}
                disabled={!isFormValid || isLoading}
              >
                Continue
                <GoArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center bg-gray-50 w-1/2 h-full">
          <Image
            src="/icons/userinfo.svg"
            width={518}
            height={308}
            alt="User Information Illustration"
          />
        </div>
      </div>
    </>
  );
};

export default UserInfo;
