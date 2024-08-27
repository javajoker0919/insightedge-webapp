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

  return (
    <>
      <HeaderImage />
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
        />
      )}
    </>
  );
};

export default Onboarding;
