"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import { useToastContext } from "@/contexts/toastContext";
import HeaderImage from "@/app/components/HeaderImage";

const ForgotPassword = () => {
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const { validateEmail } = useValidation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState({ email: "" });
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsValidForm(!!email && !error.email);
  }, [email, error]);

  const handleInputChange = (value: string) => {
    setEmail(value);
    const { validate, error } = validateEmail(value);
    setError({ email: validate ? "" : error });
  };

  const handleForgotPassword = async () => {
    if (!isValidForm) {
      setError({ email: validateEmail(email).error });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
      });
      if (error) throw error;

      localStorage.setItem("email", email);

      invokeToast("success", "Password reset link sent to your email!");
      router.push("/auth/reset-confirm");
    } catch (error: any) {
      console.error("Password reset error:", error.message, error.status);
      invokeToast(
        "error",
        `Error: ${error.message || "An error occurred during password reset"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full h-screen items-center justify-center flex">
      <HeaderImage />
      <div className="flex flex-col items-center max-w-[596px] w-full px-10">
        <Image
          alt="forgot-password"
          src={"/image/forgot-password.png"}
          width={180}
          height={180}
        />
        <div className="text-[40px] leading-[56px] font-bold text-[#323743FF]">
          Forgot your password?
        </div>
        <div className="text-sm font-normal leading-6 text-[#9095A1FF]">
          Enter your email so that we can send you password reset link
        </div>
        <div className="flex w-full flex-col text-center space-y-4 mt-8">
          <input
            type="email"
            className="rounded-full font-normal text-lg border border-[#BDC1CAFF] py-2 px-5 outline-none"
            placeholder="e.g. username@kinety.com"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
          <button
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-medium leading-7 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleForgotPassword}
            disabled={!isValidForm || isLoading}
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
              "Send Email"
            )}
          </button>
          <Link
            href={"/auth/sign-in"}
            className="text-base leading-7 font-medium text-primary-400 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
