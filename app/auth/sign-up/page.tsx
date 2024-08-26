"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { userMetadataAtom, userInfoAtom } from "@/utils/atoms";
import { useToastContext } from "@/contexts/toastContext";
import useValidation from "@/hooks/useValidation";
import { Logo } from "@/app/components";

const SignUp = () => {
  const { validateEmail, validatePassword } = useValidation();
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setUserData = useSetAtom(userInfoAtom);

  const { invokeToast } = useToastContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { email, password } = formData;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    const allFieldsFilled = Boolean(email && password);

    setIsValidate(allFieldsFilled && !hasErrors);
  }, [formData, errors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const { validate, error } = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: validate ? "" : error }));
    } else if (name === "password") {
      const { validate, error } = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: validate ? "" : error }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!isValidate) {
      invokeToast("error", "Please fill in all fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SERVER_URL}/onboarding`,
        },
      });

      if (authError) throw authError;

      setUserMetadata(authData.user?.user_metadata || null);

      // Set user data using the userInfoAtom
      setUserData({
        id: authData.user?.id || "",
        email: authData.user?.email || "",
        firstName: "",
        lastName: "",
        companyName: "",
      });

      router.replace("/auth/verify-email");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      invokeToast("error", error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/callback`,
        },
      });
      if (error) {
        throw error;
      }

      // You might want to redirect the user or update the UI here
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row w-full h-screen">
      <div className="flex flex-col w-full xl:w-1/2 h-full bg-white">
        <div className="flex items-center mt-4 ml-4">
          <Link href="/app">
            <Image
              src="/favicon.png"
              alt="ProspectEdge Logo"
              width={40}
              height={40}
            />
          </Link>
          <Logo />
        </div>
        <div className="flex flex-col mt-8 lg:mt-24 items-center w-full">
          <div className="flex flex-col w-full max-w-md text-center px-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
              Create an account
            </h1>
            <div className="flex flex-col items-center justify-center w-full mx-auto text-center text-gray-600 mb-6 text-sm font-normal leading-snug">
              <p>By creating an account, you agree to this app's</p>
              <div className="flex flex-row gap-1 text-sm">
                <Link
                  href="/terms"
                  className="text-primary-400 underline font-bold"
                >
                  Terms
                </Link>
                <span>and</span>
                <Link
                  href="/privacy"
                  className="text-primary-400 underline font-bold"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center gap-2 cursor-pointer text-sm lg:text-base py-3 lg:py-4 font-normal leading-6 rounded-full text-black border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
            >
              <Image
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              <span className="font-semibold">Sign Up with Google</span>
            </button>
            <div className="flex items-center w-full my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-xs lg:text-sm font-bold text-gray-500">
                OR SIGN UP WITH YOUR EMAIL
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <form onSubmit={handleFormSubmit} className="flex flex-col w-full">
              <div className="flex flex-col w-full mb-4">
                <label
                  htmlFor="email"
                  className="text-left text-sm lg:text-base font-bold leading-6 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="outline-none text-sm lg:text-base font-normal bg-gray-100 leading-6 p-3 lg:p-4 rounded-md"
                  placeholder="example.email@gmail.com"
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs lg:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full mb-4">
                <label
                  htmlFor="password"
                  className="text-left text-sm lg:text-base font-bold leading-6 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="outline-none text-sm lg:text-base font-normal bg-gray-100 leading-6 p-3 lg:p-4 rounded-md"
                  placeholder="••••••••"
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs lg:text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white text-sm lg:text-base font-semibold py-3 lg:py-4 mt-2 rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 lg:h-6 lg:w-6 text-white"
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
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center xl:absolute xl:bottom-8 xl:left-1/4 xl:transform xl:-translate-x-1/2 font-bold text-sm text-gray-600">
          <span>Have an account? </span>
          <Link
            href="/auth/sign-in"
            className="text-primary-400 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
      <div className="hidden xl:flex justify-center w-1/2 h-full bg-[url('/sign.png')] bg-cover bg-center">
        <div className="flex flex-col items-center">
          <div className="text-center mb-[70px] h-[70px] mt-44">
            <p className="text-[32px] leading-[48px] font-bold text-gray-700">
              Welcome to ProspectEdge!
            </p>
            <p className="text-lg font-normal leading-7 text-gray-600">
              First things first, let's set you up with an account! 👋
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
