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
  setProductsServices,
  setSymbols,
}: {
  setOnboardingStep: any;
  formData: any;
  website: any;
  companyOverview: any;
  productsServices: any;
  setWebsite: any;
  setCompanyOverview: any;
  setProductsServices: any;
  setSymbols: (symbols: string[]) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const scrapeData = async () => {
    try {
      setIsLoading(true);

      const reqData = {
        company_url: website,
        company_name: formData.companyName,
      };

      const data = await getScrapeData(reqData);

      setCompanyOverview(data.data.overview);
      setProductsServices(data.data.products);
      setSymbols(data.data.similar_company_symbols);
    } catch (error) {
      console.error("Error scraping company data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-y-scroll">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 h-full p-4 lg:p-8 mt-20 lg:mt-0 bg-white">
        <div className="flex flex-col justify-center items-center w-full max-w-[500px]">
          <div className="flex flex-col items-center w-full space-y-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-fade-in-down">
              Your Company Profile
            </h2>
            <div className="flex flex-col justify-center text-lg leading-7 w-full mb-6 animate-fade-in-up">
              <label
                htmlFor="website"
                className="font-semibold text-gray-700 mb-2"
              >
                Enter Your Company Website
              </label>
              <div className="relative">
                <input
                  id="website"
                  type="url"
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="https://www.yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-1 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <button
              className="text-base font-medium leading-7 text-white bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg shadow-lg w-full mt-8 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
              disabled={isLoading || !website}
              onClick={scrapeData}
            >
              {isLoading ? (
                <span className="flex justify-center items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Analyzing Your Website...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generate Company Profile with AI
                </span>
              )}
            </button>
            <p className="text-sm font-normal leading-5 text-gray-500 animate-fade-in">
              (Recommended for optimal results and personalized insights)
            </p>
            {/* <div className="flex flex-col w-full text-sm font-normal leading-6 text-gray-600 text-center mt-12 bg-gray-50 p-6 rounded-lg shadow-md animate-fade-in-up">
              <p className="mb-4 font-semibold text-lg">Our AI-powered analysis will provide:</p>
              <ul className="list-none mb-4 space-y-4">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-base">A comprehensive company overview</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-base">Detailed product and service insights</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-base">Tailored industry recommendations</span>
                </li>
              </ul>
              <p className="text-gray-700 text-base">
                This information will be used to customize your experience, providing targeted summaries, sales opportunities, and marketing strategies.
              </p>
            </div> */}
            <div className="mt-20 w-full flex flex-col sm:flex-row justify-between gap-4">
              <button
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                onClick={() => setOnboardingStep(0)}
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
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
      <div className="flex flex-col lg:bg-gray-50 w-full lg:w-1/2 px-4 lg:px-16 items-center justify-center h-full mt-10 lg:mt-0">
        <div className="flex flex-col justify-center w-full max-w-[500px] lg:max-w-full">
          {/* <p className="text-gray-600 mb-8">
            We've analyzed your website and prepared the following information.
            Please review and edit if necessary.
          </p> */}
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
              <label
                htmlFor="companyOverview"
                className="text-xl font-semibold text-gray-700"
              >
                Company Overview
              </label>
              <textarea
                id="companyOverview"
                className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500"
                rows={8}
                value={companyOverview}
                onChange={(e) => setCompanyOverview(e.target.value)}
                placeholder="Your company's mission, vision, and key offerings..."
              ></textarea>
            </div>
            <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
              <label
                htmlFor="productsServices"
                className="text-xl font-semibold text-gray-700"
              >
                Products and Services
              </label>
              <textarea
                id="productsServices"
                className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500"
                rows={8}
                value={productsServices}
                onChange={(e) => setProductsServices(e.target.value)}
                placeholder="Main products and services offered by your company..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCompanyProfileSection;
