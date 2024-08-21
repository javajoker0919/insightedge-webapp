"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Link from "next/link";

const OnboardingUserProfileSection = ({
  setOnboardingStep,
  formData,
  setFormData,
}: {
  setOnboardingStep: any;
  formData: any;
  setFormData: any;
}) => {
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

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

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full h-screen">
        <Link href="/app">
          <div className="flex items-center absolute top-4 left-4 z-20">
            <Image
              src="/favicon.png"
              alt="ProspectEdge Logo"
              width={40}
              height={40}
            />
            <Image src="/logo.png" alt="ProspectEdge" width={200} height={40} className="hidden sm:block" />
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 h-full z-10 px-4 sm:px-8 lg:px-12 py-20 lg:py-0">
          <div className="flex flex-col w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight my-8 sm:my-16 text-center lg:text-left">
              Tell Us About Yourself
            </h1>
            <form className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="text-base sm:text-lg font-bold leading-7"
                >
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  className="px-4 outline-none font-normal text-base sm:text-lg text-gray-900 border border-gray-300 rounded-md w-full h-12 sm:h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-base sm:text-lg font-bold leading-7"
                >
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  className="px-4 outline-none font-normal text-base sm:text-lg text-gray-900 border border-gray-300 rounded-md w-full h-12 sm:h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="companyName"
                  className="text-base sm:text-lg font-bold leading-7"
                >
                  Company Name*
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  className="px-4 outline-none font-normal text-base sm:text-lg text-gray-900 border border-gray-300 rounded-md w-full h-12 sm:h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="industry"
                  className="text-base sm:text-lg font-bold leading-7"
                >
                  Industry*
                </label>
                <input
                  type="text"
                  id="industry"
                  value={formData.industry}
                  className="px-4 outline-none font-normal text-base sm:text-lg text-gray-900 border border-gray-300 rounded-md w-full h-12 sm:h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                />
              </div>
            </form>
            <div className="flex justify-between mt-8 sm:mt-10 w-full">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                disabled
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setOnboardingStep(1)}
                disabled={!isFormValid}
              >
                Continue
                <GoArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-gray-50 w-1/2 h-full bg-[url('/userinfo.png')] bg-cover bg-center"></div>
      </div>
    </>
  );
};

export default OnboardingUserProfileSection;
