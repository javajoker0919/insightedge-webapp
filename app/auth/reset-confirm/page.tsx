"use client";

import { useState } from "react";
import Image from "next/image";
import HeaderImage from "@/app/components/HeaderImage";
import { supabase } from "@/utils/supabaseClient";
import { useToastContext } from "@/contexts/toastContext";

const ResetConfirm = () => {
  const { invokeToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleResendEmail = async () => {
    const email = localStorage.getItem("email");
    if (!email) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
      });
      if (error) throw error;
      localStorage.removeItem("email");
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
    <div className="flex w-full h-screen items-center justify-center">
      <HeaderImage />
      <div className="flex flex-col items-center text-center max-w-[596px] w-full px-10">
        <Image
          src="/image/confirm-email.png"
          width={180}
          height={180}
          alt="Confirm Email"
          priority
        />
        <p className="text-[40px] leading-[56px] font-bold text-[#323743FF]">
          Check your email!
        </p>
        <p className="text-sm font-normal leading-6 text-[#9095A1FF] mx-12">
          An email has been sent with a link to verify your account ownership.
          If you don't receive the email, please contact
          <a
            href="mailto:support@kinety.com"
            className="text-blue-600 hover:underline"
          >
            {" "}
            support@kinety.com
          </a>
        </p>
        <div className="w-full space-y-4 mt-8">
          <button
            type="button"
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-medium py-3 rounded-full"
          >
            Open email inbox
          </button>
          <button
            type="button"
            className="w-full bg-white hover:bg-gray-100 active:bg-gray-200 text-primary-600 text-lg font-medium py-3 rounded-full border border-primary-600"
            onClick={handleResendEmail}
            disabled={isLoading}
          >
            Resend email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirm;
