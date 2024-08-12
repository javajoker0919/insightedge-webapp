"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HeaderImage from "@/app/components/HeaderImage";
import { supabase } from "@/utils/supabaseClient";

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isValid = password.length >= 8 && password === confirmPassword;

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      router.push("/auth/reset-success");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <HeaderImage />
      <div className="flex flex-col items-center text-center max-w-[596px] w-full px-10">
        <Image
          alt="Reset Password"
          src="/image/reset-password.png"
          width={180}
          height={180}
        />
        <h1 className="text-[40px] leading-[56px] font-bold text-[#323743FF] w-full">
          Reset Password
        </h1>
        <p className="text-sm font-normal leading-6 text-[#9095A1FF] w-full mb-8">
          Please set your new password below.
        </p>
        <div className="flex flex-col w-full space-y-4">
          <div>
            <label
              htmlFor="new-password"
              className="text-lg font-bold leading-7 flex mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="hs-strong-password-with-indicator-and-hint"
              className="py-3 px-4 block w-full border border-gray-300 rounded-full text-sm outline-none"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              id="hs-strong-password"
              data-hs-strong-password='{
                  "target": "#hs-strong-password-with-indicator-and-hint",
                  "hints": "#hs-strong-password-hints",
                  "stripClasses": "hs-strong-password:opacity-100 hs-strong-password-accepted:bg-teal-500 h-2 flex-auto rounded-full bg-blue-500 opacity-50 mx-1"
                }'
              className="flex mt-2 -mx-1"
            ></div>
          </div>
          <div id="hs-strong-password-hints" className="my-3">
            <div className="flex gap-1">
              <span className="text-sm text-gray-800">Password Level:</span>
              <span
                data-hs-strong-password-hints-weakness-text='["Empty", "Weak", "Medium", "Strong", "Very Strong", "Super Strong"]'
                className="text-sm font-semibold text-gray-800"
              ></span>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="text-lg font-bold leading-7 flex mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="py-3 px-4 block w-full border border-gray-300 rounded-full text-sm outline-none"
              placeholder="Re-enter new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-medium leading-7 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!isValid || isLoading}
            onClick={handleResetPassword}
          >
            {isLoading ? (
              <span className="flex justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-7 w-7 text-white"
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
              "Reset password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
