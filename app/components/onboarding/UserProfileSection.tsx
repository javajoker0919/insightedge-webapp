"use client";

import { useEffect, useState } from "react";

import { GoArrowLeft, GoArrowRight } from "react-icons/go";

import Logo from "../Logo";
import Select from "react-select";

const filteredIndustries = [
  { value: "Retail", label: "Retail" },
  { value: "Energy", label: "Energy" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Financial Services", label: "Financial Services" },
  { value: "Technology", label: "Technology" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Consumer Goods", label: "Consumer Goods" },
  { value: "Utilities", label: "Utilities" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Transportation & Logistics", label: "Transportation & Logistics" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Materials & Chemicals", label: "Materials & Chemicals" },
  { value: "Industrial Goods", label: "Industrial Goods" },
  { value: "Media & Entertainment", label: "Media & Entertainment" },
  { value: "Agriculture", label: "Agriculture" },
  { value: "Aerospace & Defense", label: "Aerospace & Defense" },
  { value: "Construction & Engineering", label: "Construction & Engineering" },
  { value: "Hospitality & Leisure", label: "Hospitality & Leisure" },
  { value: "Professional Services", label: "Professional Services" },
  { value: "Education", label: "Education" },
];

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

  const handleIndustryChange = (selectedOption: any) => {
    handleInputChange("industry", selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full h-screen">
        <div className="absolute top-4 left-4 z-20">
          <Logo withIcon />
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
                <Select
                  id="industry"
                  value={filteredIndustries.find(
                    (option) => option.value === formData.industry
                  )}
                  onChange={handleIndustryChange}
                  options={filteredIndustries}
                  placeholder="Search for an industry"
                  className="w-full"
                  classNamePrefix="react-select"
                />
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
