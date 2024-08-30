"use client";

import { useState } from "react";
import HeaderImage from "@/app/components/HeaderImage";
import {
  OnboardingUserProfileSection,
  OnboardingCompanyProfileSection,
  OnboardingInitialCompanySection,
} from "@/app/components";

const Onboarding = () => {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: "",
  });
  const [website, setWebsite] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [productsServices, setProductsServices] = useState("");
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <HeaderImage />
      {!isLoading && (
        <div className="fixed top-0 left-0 z-50 w-1/2">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-end justify-end mt-4">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-16 rounded ${
                      onboardingStep >= 0 ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 w-16 rounded ${
                      onboardingStep >= 1 ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 w-16 rounded ${
                      onboardingStep >= 2 ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {onboardingStep === 0 && "Step 1: User Profile"}
                  {onboardingStep === 1 && "Step 2: Company Profile"}
                  {onboardingStep === 2 && "Step 3: Watchlist Setup"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {onboardingStep === 0 && (
        <OnboardingUserProfileSection
          setOnboardingStep={setOnboardingStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {onboardingStep === 1 && (
        <OnboardingCompanyProfileSection
          formData={formData}
          website={website}
          companyOverview={companyOverview}
          productsServices={productsServices}
          setOnboardingStep={setOnboardingStep}
          setWebsite={setWebsite}
          setCompanyOverview={setCompanyOverview}
          setProductsServices={setProductsServices}
          setSymbols={setSymbols}
        />
      )}
      {onboardingStep === 2 && (
        <OnboardingInitialCompanySection
          formData={formData}
          website={website}
          companyOverview={companyOverview}
          productsServices={productsServices}
          setOnboardingStep={setOnboardingStep}
          symbols={symbols}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default Onboarding;
