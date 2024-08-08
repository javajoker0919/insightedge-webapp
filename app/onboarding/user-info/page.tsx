"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const UserInfo = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row w-full h-screen">
        <div className="flex flex-col items-center justify-center w-1/2 h-full z-10 px-12">
          <div className="flex items-center absolute top-6 left-6">
            <Image
              src="/favicon.png"
              alt="ProspectEdge Logo"
              width={40}
              height={40}
            />
            <Image src="/logo.png" alt="ProspectEdge" width={200} height={40} />
          </div>
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
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-lg font-bold leading-7"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="companyName"
                  className="text-lg font-bold leading-7"
                >
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="industry"
                  className="text-lg font-bold leading-7"
                >
                  Industry
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  className="px-4 outline-none font-normal text-lg text-gray-900 border border-gray-300 rounded-md w-full h-[52px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </form>
            <div className="flex flex-row justify-between w-full text-sm font-medium mt-40">
              <button
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled
              >
                <GoArrowLeft className="mr-2" />
                Back
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => router.push("/onboarding/company-profile")}
              >
                Continue
                <GoArrowRight className="ml-2" />
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
