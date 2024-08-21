"use client";

import { useState } from "react";
import HeaderImage from "@/app/components/HeaderImage";
import {
  OnboardingUserProfileSection,
  OnboardingCompanyProfileSection,
  OnboardingInitialCompanySection,
} from "@/app/components";

const Onboarding = () => {
  const [onboardingStep, setOnboardingStep] = useState<number>(2);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: "",
  });
  const [website, setWebsite] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [productsServices, setProductsServices] = useState("");

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
        />
      )}
      {onboardingStep === 2 && (
        <OnboardingInitialCompanySection
          formData={formData}
          website={website}
          companyOverview={companyOverview}
          productsServices={productsServices}
          setOnboardingStep={setOnboardingStep}
        />
      )}
    </>
  );
};

export default Onboarding;
