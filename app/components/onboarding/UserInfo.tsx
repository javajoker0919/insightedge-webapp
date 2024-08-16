"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const UserInfo = ({
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
      <div className="flex flex-row w-full h-screen">
        <div className="flex flex-col items-center justify-center w-1/2 h-full z-10 px-12">
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
                  type="text"
                  value={formData.firstName}
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
                  type="text"
                  value={formData.lastName}
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
                  type="text"
                  value={formData.companyName}
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
                  type="text"
                  value={formData.industry}
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
                onClick={() => setOnboardingStep(1)}
                disabled={!isFormValid}
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
