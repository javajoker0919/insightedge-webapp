"use client";

import { useState } from "react";
import HeaderImage from "@/app/components/HeaderImage";
import UserInfo from "@/app/components/onboarding/UserInfo";
import CompanyProfile from "@/app/components/onboarding/CompanyProfile";
import UserAwareness from "@/app/components/onboarding/UserAwareness";

const Onboarding = () => {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    industry: ""
  });
  const [website, setWebsite] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [productsServices, setProductsServices] = useState("");

  return (
    <>
      <HeaderImage />
      {onboardingStep === 0 && (
        <UserInfo
          setOnboardingStep={setOnboardingStep}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {onboardingStep === 1 && (
        <CompanyProfile
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
        <UserAwareness
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
