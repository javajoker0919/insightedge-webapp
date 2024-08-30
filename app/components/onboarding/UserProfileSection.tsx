"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Link from "next/link";
import Logo from "../Logo";

const filteredIndustries = [
  "Retail",
  "Energy",
  "Healthcare",
  "Financial Services",
  "Technology",
  "Manufacturing",
  "Consumer Goods",
  "Utilities",
  "Real Estate",
  "Transportation & Logistics",
  "Telecommunications",
  "Materials & Chemicals",
  "Industrial Goods",
  "Media & Entertainment",
  "Agriculture",
  "Aerospace & Defense",
  "Construction & Engineering",
  "Hospitality & Leisure",
  "Professional Services",
  "Education"
];

const OnboardingUserProfileSection = ({
  setOnboardingStep,
  formData,
  setFormData
}: {
  setOnboardingStep: any;
  formData: any;
  setFormData: any;
}) => {
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: ""
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

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
        <div className="flex items-center absolute top-4 left-4 z-20">
          <Link href="/app">
            <Image
              src="/favicon.png"
              alt="ProspectEdge Logo"
              width={40}
              height={40}
            />
          </Link>
          <div className="hidden sm:block">
            <Logo />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 h-full z-10 px-6 sm:px-12 lg:px-16 py-20 lg:py-0">
          <div className="flex flex-col w-full max-w-[500px]">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 text-center lg:text-left text-gray-800">
              Welcome to ProspectEdge
            </h1>
            <p className="text-gray-600 mb-8 text-sm">
              Let's get to know you better. This information helps us
              personalize your experience.
            </p>
            <form className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="block text-base font-bold text-gray-700 mb-1"
                  >
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="John"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="block text-base font-bold text-gray-700 mb-1"
                  >
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-base font-bold text-gray-700 mb-1"
                >
                  Company Name*
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-base font-bold text-gray-700 mb-1"
                >
                  Industry*
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      id="industry"
                      value={formData.industry}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
                      onChange={(e) => {
                        setShowIndustryDropdown(false);
                        handleInputChange("industry", e.target.value);
                      }}
                      placeholder="Search for an industry"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {formData.industry && (
                    <div
                      className={`${
                        showIndustryDropdown ? "hidden" : ""
                      } absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm`}
                    >
                      {filteredIndustries
                        .filter((industry) =>
                          industry
                            .toLowerCase()
                            .includes(formData.industry.toLowerCase())
                        )
                        .map((industry: string) => (
                          <div
                            key={industry}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                            onClick={() => {
                              handleInputChange("industry", industry);
                              setShowIndustryDropdown(true); // Assuming you have a state variable to control the dropdown visibility
                            }}
                          >
                            <span className="block truncate">{industry}</span>
                            {formData.industry === industry && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
            <div className="flex justify-between mt-8">
              <button
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setOnboardingStep(1)}
                disabled={!isFormValid}
              >
                Continue
                <GoArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
          <img
            src="/userinfo.png"
            alt="User Profile Onboarding"
            className="max-w-full h-full"
          />
        </div>
      </div>
    </>
  );
};

export default OnboardingUserProfileSection;
