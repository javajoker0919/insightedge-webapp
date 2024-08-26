"use client";

import { useState } from "react";
import { useAtomValue } from "jotai/react";
import { userInfoAtom } from "@/utils/atoms";
import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";
import Image from "next/image";
import Link from "next/link";
import { MdMarkEmailRead } from "react-icons/md";
import HeaderImage from "@/app/components/HeaderImage";

const VerifyEmail = () => {
  const userinfo = useAtomValue(userInfoAtom);
  const { invokeToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: userinfo?.email ?? "",
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
        }
      });
      if (error) throw error;
      invokeToast("success", "Resend request sent to your email!");
    } catch (error: any) {
      invokeToast(
        "error",
        `Error: ${error.message || "An error occurred during password reset"}`
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col items-center justify-center w-1/2 h-full bg-white z-10">
        <HeaderImage />
        <div className="flex flex-col items-center">
          <div className="max-w-md w-full px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Verify your email
            </h1>
            <div className="flex items-center justify-center mb-8">
              <MdMarkEmailRead className="text-6xl text-primary-600" />
            </div>
            <p className="text-gray-600 text-sm font-normal leading-6 mb-8 text-center w-full">
              An email has been sent to{" "}
              <span className="font-semibold">{userinfo?.email}</span> with a
              link to verify your account. If you don't see the email, please
              check your spam folder before clicking "Resend".
            </p>
            <button
              onClick={handleResendEmail}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold w-full py-4 rounded transition duration-300 ease-in-out disabled:opacity-40"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex justify-center">
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
                </span>
              ) : (
                "Resend email"
              )}
            </button>
            <div className="flex justify-center mt-6 text-sm gap-1 font-bold">
              <span className="text-gray-600">Need some help?</span>
              <Link
                href="/support"
                className="text-primary-600 hover:text-primary-800 ml-1 font-semibold"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 w-1/2 h-full relative">
        <Image
          src="/icons/verify-2.svg"
          width={358}
          height={264}
          alt="Welcome illustration"
          className="absolute top-[180px] -left-16"
        />
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 rounded-[50%] bg-gray-200 w-[600px] h-[8.5rem] z-0"></div>
            <Image
              src="/icons/verify-1.svg"
              width={431}
              height={342}
              alt="Welcome illustration"
              className="relative z-10 scale-x-[-1] bottom-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
