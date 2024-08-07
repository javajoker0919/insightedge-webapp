"use client";

/// Import necessary dependencies and components
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { userMetadataAtom, userInfoAtom } from "@/utils/atoms";
import { useToastContext } from "@/contexts/toastContext";
import useValidation from "@/hooks/useValidation";
import AuthInput from "@/app/components/SignInput";
import { createCustomer } from "@/utils/apiClient";

/// SignUp component for user registration
const SignUp = () => {
  /// Custom hooks for validation and context
  const { validateEmail, validatePassword } = useValidation();
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setUserData = useSetAtom(userInfoAtom);

  const { invokeToast } = useToastContext();
  const router = useRouter();

  /// State for form data and errors
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPass: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPass: ""
  });

  /// State to track form validation, checkbox, and loading
  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /// Effect to check form validity
  useEffect(() => {
    const { email, password, confirmPass } = formData;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    const allFieldsFilled = Boolean(email && password);

    setIsValidate(allFieldsFilled && !hasErrors);
  }, [formData, errors]);

  /// Handle input changes and validate fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const { validate, error } = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: validate ? "" : error }));
    } else if (name === "password" || name === "confirmPass") {
      const { validate, error } = validatePassword(value);
      setErrors((prev) => ({ ...prev, [name]: validate ? "" : error }));
    }
  };

  /// Handle form submission for user registration
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    setIsLoading(true);

    try {
      /// Sign up user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/onboarding/user-info"
        }
      });

      if (authError) throw authError;

      /// Insert user data into 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert({ id: authData.user?.id, email: authData.user?.email })
        .select()
        .single();

      if (userError) throw userError;

      setUserMetadata(authData.user?.user_metadata || null);

      createCustomer();

      // Set user data using the userInfoAtom
      setUserData({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        onboardingStatus: false
      });

      // invokeToast("success", "Successfully signed up!", "top");
      router.replace("/auth/verify-email");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      invokeToast("error", error.message || "Something went wrong!", "top");
    } finally {
      setIsLoading(false);
    }
  };

  /// Render the sign-up form
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col w-1/2 h-full bg-white">
        <div className="flex items-center  mt-6 ml-6">
          <Image
            src="/favicon.png"
            alt="ProspectEdge Logo"
            width={40}
            height={40}
          />
          <Image src="/logo.png" alt="ProspectEdge" width={200} height={40} />
        </div>
        <div className="flex flex-col mt-24 items-center w-full">
          <div className="flex flex-col w-[26rem] text-center">
            <h1 className="text-3xl font-bold text-gray-900 leading-[48px] mb-3">
              Create an account
            </h1>
            <div className="flex flex-col items-center justify-center max-w-[342px] w-full mx-auto text-center text-gray-600 mb-4 text-sm font-normal leading-[22px]">
              <p>By creating an account, you agree to this app's</p>
              <div className="flex flex-row gap-1 text-sm">
                <Link href="/" className="text-primary-400 underline font-bold">
                  Terms
                </Link>
                <span>and</span>
                <Link href="/" className="text-primary-400 underline font-bold">
                  Privacy Policy
                </Link>
              </div>
            </div>
            <button className="w-full flex justify-center items-center gap-2 cursor-pointer text-base py-4 font-normal leading-6 rounded-full text-black border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
              <Image
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              <span className="text-base font-semibold">
                Sign Up with Google
              </span>
            </button>
            <div className="flex items-center w-full mt-8 mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-sm font-bold text-gray-500">
                OR SIGN UP WITH YOUR EMAIL
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <form
              // onSubmit={handleFormSubmit}
              className="flex flex-col w-full mt-3"
            >
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="text-left text-base font-bold leading-6 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="outline-none text-base font-normal bg-gray-100 leading-6 p-4 rounded-md"
                  placeholder="example.email@gmail.com"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col w-ufll mt-2">
                <label
                  htmlFor="password"
                  className="text-left text-base font-bold leading-6 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="outline-none text-base font-normal bg-gray-100 leading-6 p-4 rounded-md"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                />
              </div>
              <button
                // type="submit"
                className="w-full bg-primary-600 text-white text-base font-semibold py-4 mt-4 rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!isValidate || isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
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
                    Signing Up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 font-bold text-sm text-gray-600">
          <span>Have an account? </span>
          <Link
            href="/auth/sign-in"
            className="text-primary-400 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 w-1/2 h-full">
        <div className="flex flex-col items-center">
          <div className="text-center mb-[70px]">
            <p className="text-[32px] leading-[48px] font-bold text-gray-700">
              Welcome to ProspectEdge!
            </p>
            <p className="text-lg font-normal leading-7 text-gray-600">
              First things first, let's set you up with an account! 👋
            </p>
          </div>
          <div className="relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-[50%] bg-gray-200 w-[600px] h-[8.5rem] z-0"></div>
            <Image
              src="/welcome.svg"
              width={513}
              height={416}
              alt="Welcome illustration"
              className="relative z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
