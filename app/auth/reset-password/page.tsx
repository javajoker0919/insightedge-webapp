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
  const isValid = password.length >= 8 && password === confirmPassword;

  const handleResetPassword = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      router.push("/auth/reset-success");
    } catch (error) {
      console.error(error);
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
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-medium leading-7 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!isValid}
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
