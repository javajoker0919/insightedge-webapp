"use client";

import { useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { getScrapeData } from "@/utils/apiClient";

const OnboardingCompanyProfileSection = ({
  formData,
  website,
  companyOverview,
  productsServices,
  setOnboardingStep,
  setWebsite,
  setCompanyOverview,
  setProductsServices
}: {
  setOnboardingStep: any;
  formData: any;
  website: any;
  companyOverview: any;
  productsServices: any;
  setWebsite: any;
  setCompanyOverview: any;
  setProductsServices: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const scrapeData = async () => {
    try {
      setIsLoading(true);

      const reqData = {
        company_url: website,
        company_name: formData.companyName
      };

      const data = await getScrapeData(reqData);

      setCompanyOverview(data.data.overview);
      setProductsServices(data.data.products);
    } catch (error) {
      console.error("Error scraping company data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-y-scroll">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 h-full p-4 lg:p-8 mt-20 lg:mt-0">
        <div className="flex flex-col justify-center items-center w-full max-w-[500px]">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col justify-center text-lg leading-7 w-full mb-6">
              <label htmlFor="website" className="font-bold text-gray-800 mb-2">
                Website
              </label>
              <input
                id="website"
                type="url"
                className="font-normal border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <button
              className="text-base font-medium leading-7 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md shadow-sm w-full mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={isLoading}
              onClick={scrapeData}
            >
              {isLoading ? (
                <span className="flex justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : (
                "Summarize Company Using AI"
              )}
            </button>
            <p className="text-sm font-normal leading-5 text-gray-500 mt-2">
              (Recommended)
            </p>
            <div className="flex flex-col w-full text-sm font-normal leading-6 text-gray-600 text-center mt-12">
              <p className="mb-2">Our AI will scan your website to create:</p>
              <ul className="list-disc list-inside mb-4">
                <li>A brief company profile</li>
                <li>A list of your products and services</li>
              </ul>
              <p>
                This helps us customize your experience and tailor summaries,
                sales opportunities, and marketing strategies based on your
                company.
              </p>
            </div>
          </div>
          {/* <div className="justify-between mt-10 w-full lg:flex hidden">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              onClick={() => setOnboardingStep(0)}
            >
              <GoArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
          </div> */}
        </div>
      </div>
      <div className="flex flex-col lg:bg-gray-50 w-full lg:w-1/2 px-4 lg:px-16 items-center justify-center h-full mt-10 lg:mt-0">
        <div className="flex flex-col justify-center w-full max-w-[500px] lg:max-w-full">
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-8">
              <p className="text-sm leading-5 font-normal text-[#171A1FFF]">
                Company Profile
              </p>
              <textarea
                className="text-sm leading-6 font-normal text-[#171A1FFF] w-full border border-[#BDC1CAFF] rounded-sm outline-none px-4 py-3"
                rows={8}
                value={companyOverview}
                onChange={(e) => setCompanyOverview(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-sm leading-5 font-normal text-[#171A1FFF]">
                Products & Services
              </p>
              <textarea
                className="text-sm leading-6 font-normal text-[#171A1FFF] w-full border border-[#BDC1CAFF] rounded-sm outline-none px-4 py-3"
                rows={8}
                value={productsServices}
                onChange={(e) => setProductsServices(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="mt-8 w-full flex flex-row justify-between gap-4 mb-8 lg:mb-0">
            {/* <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto">
              Enter data manually
            </button> */}
            <div className="flex flex-row justify-between w-full">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setOnboardingStep(0)}
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto"
                onClick={() => setOnboardingStep(2)}
                disabled={!website || !companyOverview || !productsServices}
              >
                Continue
                <GoArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCompanyProfileSection;
