"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthInput from "@/app/components/SignInput";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import { useToastContext } from "@/contexts/toastContext";

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

  useEffect(() => {
    console.log(!isValidForm || isLoading);
  }, [isValidForm, isLoading]);

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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      invokeToast("success", "Password reset link sent to your email!", "top");
      router.push("/auth/sign-in");
    } catch (error: any) {
      console.error("Password reset error:", error);
      invokeToast("error", "An error occurred during password reset", "top");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="flex flex-col lg:flex-row justify-center h-full">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            <div className="md:w-[400px] min-w-72 w-full shadow-slate-200 rounded-xl md:shadow-2xl md:p-8">
              <header className="text-center mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold mb-2">
                  Forgot Password
                </h2>
              </header>

              <div className="flex flex-col gap-5">
                <div className="space-y-1">
                  <p className="text-slate-600">Email</p>
                  <AuthInput
                    error={error.email}
                    type="email"
                    onChange={(e: any) => handleInputChange(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleForgotPassword}
                  disabled={!isValidForm || isLoading}
                  className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </div>

            <div className="text-center flex items-center gap-2 justify-center text-gray-900 text-base font-medium">
              <Link
                href="/auth/sign-in"
                className="font-semibold text-indigo-400"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
