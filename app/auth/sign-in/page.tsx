"use client";

/// Import necessary dependencies and components
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthInput from "@/app/components/SignInput";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import { useToastContext } from "@/contexts/toastContext";
import { useAtom } from "jotai";
import { userMetadataAtom } from "@/utils/atoms";

const SignIn = () => {
  /// Initialize hooks and contexts
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const [, setUserMetadata] = useAtom(userMetadataAtom);

  const { validateEmail, validatePassword } = useValidation();

  /// State for user credentials, form errors, and form validation
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /// Effect to check form validity whenever credentials or errors change
  useEffect(() => {
    const { email, password } = credentials;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    setIsValidForm(!!email && !!password && !hasErrors);
  }, [credentials, errors]);

  /// Handle input changes and validate fields
  const handleInputChange = (field: "email" | "password", value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    const { validate, error } =
      field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: validate ? "" : error }));
  };

  /// Handle sign-in process
  const handleSignInClick = async () => {
    const { email, password } = credentials;

    /// Validate form before submission
    if (!isValidForm) {
      setErrors({
        email: validateEmail(email).error,
        password: validatePassword(password).error,
      });
      return;
    }

    setIsLoading(true);

    try {
      /// Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      /// Set authentication state and store user info using Jotai
      setUserMetadata(data.user?.user_metadata || null);

      /// Display success toast and redirect to app
      invokeToast("success", "You have successfully logged in!", "top");
      router.replace("/app");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      /// Display error toast with appropriate message
      invokeToast(
        "error",
        error.message === "Invalid login credentials"
          ? "Please confirm your email and password"
          : "An error occurred during sign-in",
        "top"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="flex flex-col lg:flex-row justify-center h-full">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            {/* Sign-in form container */}
            <div className="md:w-[400px] w-full shadow-slate-200 rounded-xl md:shadow-2xl md:p-8">
              {/* Form header */}
              <header className="text-center mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold mb-2">
                  Sign in to your account
                </h2>
              </header>

              {/* Sign-in form */}
              <div className="flex flex-col gap-5">
                {/* Email input */}
                <div className="space-y-1">
                  <p className="text-slate-600">Email</p>
                  <AuthInput
                    error={errors.email}
                    type="email"
                    onChange={(e: any) =>
                      handleInputChange("email", e.target.value)
                    }
                  />
                </div>

                {/* Password input */}
                <div className="space-y-1">
                  <div className="flex w-full justify-between items-center">
                    <p className="text-slate-600">Password</p>
                    <p
                      onClick={() => router.push("/auth/forgot-password")}
                      className="modal-open cursor-pointer text-success-300 font-semibold text-sm text-indigo-500"
                    >
                      Forgot Password?
                    </p>
                  </div>
                  <AuthInput
                    error={errors.password}
                    type="password"
                    onChange={(e: any) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                </div>

                {/* Sign-in button */}
                <button
                  onClick={handleSignInClick}
                  disabled={!isValidForm || isLoading}
                  className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white rounded-full px-4 py-1 text-base text-gray-600">
                    Or
                  </span>
                </div>
              </div>

              {/* Google Sign-in button */}
              <div className="flex flex-col gap-4">
                <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 text-black border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-slate-200">
                  <Image
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="google_logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-base font-semibold ">
                    Sign In with Google
                  </span>
                </div>
              </div>
            </div>

            {/* Sign-up link */}
            <div className="text-center flex items-center gap-2 justify-center text-gray-900 text-base font-medium">
              <Link
                href="/auth/sign-up"
                className="font-semibold text-indigo-400"
              >
                Sign Up
              </Link>
              <p className="text-slate-600">if you don't have an account yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
