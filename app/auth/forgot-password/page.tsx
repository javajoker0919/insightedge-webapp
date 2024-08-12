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
      console.error(error);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://insightedge-webapp.vercel.app/auth/reset-password`,
      });
      if (error) throw error;

      localStorage.setItem("email", email);

      invokeToast("success", "Password reset link sent to your email!", "top");
      router.push("/auth/reset-confirm");
    } catch (error: any) {
      console.error("Password reset error:", error.message, error.status);
      invokeToast(
        "error",
        `Error: ${error.message || "An error occurred during password reset"}`,
        "top"
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
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-medium leading-7 py-3 rounded-full"
            onClick={handleForgotPassword}
          >
            Send Email
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
