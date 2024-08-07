"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const UserAwareness = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row w-full h-screen">
        <div className="flex flex-col items-center justify-center w-1/2 h-full">
          <div className="flex items-center absolute top-6 left-6">
            <Image
              src="/favicon.png"
              alt="ProspectEdge Logo"
              width={40}
              height={40}
            />
            <Image src="/logo.png" alt="ProspectEdge" width={200} height={40} />
          </div>
          <div className="flex flex-col w-full px-16">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8">
              How did you hear about ProspectEdge?
            </h1>
            <form className="space-y-4">
              {[
                "Search engines (Google, Safari, Bing, etc.)",
                "Social media (Facebook, Instagram, X, TikTok, etc.)",
                "Podcast or radio",
                "Streaming platforms (YouTube, Twitch, etc.)",
                "Email",
                "Word of mouth"
              ].map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={`checkbox-${index}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`checkbox-${index}`}
                    className="ml-2 text-lg font-medium text-gray-900"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </form>
            <div className="flex justify-between mt-8">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => router.push("/onboarding/company-profile")}
              >
                <GoArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                Dashboard
                <GoArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex bg-gray-50 w-1/2 items-center justify-center h-full">
          <div className="relative">
            <div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-[50%] w-[365px] h-[59px] bg-[#EAECF0] z-0"
              aria-hidden="true"
            ></div>
            <Image
              alt="User Awareness Illustration"
              src="/icons/user-awareness.svg"
              width={454}
              height={451}
              className="relative z-10"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAwareness;
