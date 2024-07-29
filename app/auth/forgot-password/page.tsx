"use client";

/// Import necessary dependencies and components
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthInput from "@/app/components/SignInput";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import { useToastContext } from "@/contexts/toastContext";

const ForgotPassword = () => {
  /// Initialize hooks and context
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const { validateEmail } = useValidation();

  /// State management
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ email: "" });
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /// Effect to update form validity
  useEffect(() => {
    setIsValidForm(!!email && !error.email);
  }, [email, error]);

  /// Handle input change and validate email
  const handleInputChange = (value: string) => {
    setEmail(value);
    const { validate, error } = validateEmail(value);
    setError({ email: validate ? "" : error });
  };

  /// Handle forgot password submission
  const handleForgotPassword = async () => {
    if (!isValidForm) {
      setError({ email: validateEmail(email).error });
      return;
    }

    setIsLoading(true);

    try {
      /// Attempt to send password reset email
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      console.log("Password reset response:", data); // Log the response data
      invokeToast("success", "Password reset link sent to your email!", "top");
      router.push("/auth/sign-in");
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

  /// Handle going back to the previous page
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="flex flex-col lg:flex-row justify-center h-full">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            {/* Forgot password form container */}
            <div className="md:w-[400px] min-w-72 w-full shadow-slate-200 rounded-xl md:shadow-2xl md:p-8">
              {/* Form header */}
              <header className="text-center mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold mb-2">
                  Forgot Password
                </h2>
              </header>

              {/* Form inputs */}
              <div className="flex flex-col gap-5">
                {/* Email input */}
                <div className="space-y-1">
                  <p className="text-slate-600">Email</p>
                  <AuthInput
                    error={error.email}
                    type="email"
                    onChange={(e: any) => handleInputChange(e.target.value)}
                  />
                </div>

                {/* Submit button */}
                <button
                  onClick={handleForgotPassword}
                  disabled={!isValidForm || isLoading}
                  className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </div>

            {/* Back to previous page button */}
            <div className="text-center flex items-center gap-2 justify-center text-gray-900 text-base font-medium">
              <button
                onClick={handleGoBack}
                className="font-semibold text-primary-400"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
