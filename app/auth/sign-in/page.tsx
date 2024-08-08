"use client";

/// Import necessary dependencies and components
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthInput from "@/app/components/SignInput";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { ImEye, ImEyeBlocked } from "react-icons/im";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import { useToastContext } from "@/contexts/toastContext";
import { useSetAtom } from "jotai";
import {
  userMetadataAtom,
  userInfoAtom,
  orgInfoAtom,
  watchlistAtom
} from "@/utils/atoms";

const SignIn = () => {
  /// Initialize hooks and contexts
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setWatchlist = useSetAtom(watchlistAtom);

  const { validateEmail, validatePassword } = useValidation();

  /// State for user credentials, form errors, and form validation
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        password: validatePassword(password).error
      });
      return;
    }

    setIsLoading(true);

    try {
      /// Attempt to sign in with Supabase and fetch user data
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      setUserMetadata(data.user?.user_metadata || null);

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userDataError) throw userDataError;

      /// Set user data using the userInfoAtom
      setUserInfo({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        onboardingStatus: userData.onboarding_status
      });

      invokeToast("success", "You have successfully logged in!", "top");

      if (!userData.onboarding_status) {
        router.replace("/auth/create-profile");
      }

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .select(
          `
          id, 
          name, 
          website, 
          overview, 
          products, 
          creator_id
          `
        )
        .eq("creator_id", data.user.id)
        .single();

      if (orgError) throw orgError;

      setOrgInfo({
        id: orgData.id,
        name: orgData.name,
        website: orgData.website,
        overview: orgData.overview,
        products: orgData.products,
        creatorID: orgData.creator_id
      });

      const { data: watchlistData, error: watchlistError } = await supabase
        .from("watchlists")
        .select(
          `
          id, 
          name, 
          organization_id, 
          creator_id,
          uuid,
          watchlist_companies!left(id, company_id)
          `
        )
        .eq("creator_id", data.user.id);

      if (watchlistError) throw watchlistError;

      setWatchlist(
        watchlistData.map((item) => {
          return {
            id: item.id,
            name: item.name,
            organizationID: item.organization_id,
            creatorID: item.creator_id,
            uuid: item.uuid,
            company_count: item.watchlist_companies?.length
          };
        })
      );

      router.replace(`/app/watchlist/${watchlistData[0].uuid}`);
    } catch (error: any) {
      console.error("Sign-in error:", error);
      /// Display error toast with appropriate message
      if (error.message === "Invalid login credentials") {
        invokeToast("error", "Please confirm your email and password", "top");
      }

      // invokeToast(
      //   "error",
      //   error.message === "Invalid login credentials"
      //     ? "Please confirm your email and password"
      //     : "An error occurred during sign-in",
      //   "top"
      // );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="bg-white w-full h-screen">
    //   <div className="flex flex-col lg:flex-row justify-center h-full">
    //     <div className="h-full px-5 flex items-center justify-center">
    //       <div className="flex flex-col gap-8 mb-16">
    //         {/* Sign-in form container */}
    //         <div className="md:w-[400px] w-full shadow-slate-200 rounded-xl md:shadow-2xl md:p-8">
    //           {/* Form header */}
    //           <header className="text-center mb-8">
    //             <h2 className="text-gray-900 text-2xl font-semibold mb-2">
    //               Sign in to your account
    //             </h2>
    //           </header>

    //           {/* Sign-in form */}
    //           <div className="flex flex-col gap-5">
    //             {/* Email input */}
    //             <div className="space-y-1">
    //               <p className="text-slate-600">Email</p>
    //               <AuthInput
    //                 error={errors.email}
    //                 type="email"
    //                 onChange={(e: any) =>
    //                   handleInputChange("email", e.target.value)
    //                 }
    //               />
    //             </div>

    //             {/* Password input */}
    //             <div className="space-y-1">
    //               <div className="flex w-full justify-between items-center">
    //                 <p className="text-slate-600">Password</p>
    //                 <p
    //                   onClick={() => router.push("/auth/forgot-password")}
    //                   className="modal-open cursor-pointer text-success-300 font-semibold text-sm text-primary-500"
    //                 >
    //                   Forgot Password?
    //                 </p>
    //               </div>
    //               <AuthInput
    //                 error={errors.password}
    //                 type="password"
    //                 onChange={(e: any) =>
    //                   handleInputChange("password", e.target.value)
    //                 }
    //               />
    //             </div>

    //             {/* Sign-in button */}
    //             <button
    //               onClick={handleSignInClick}
    //               disabled={!isValidForm || isLoading}
    //               className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
    //             >
    //               {isLoading ? (
    //                 <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
    //               ) : (
    //                 "Sign In"
    //               )}
    //             </button>
    //           </div>

    //           {/* Divider */}
    //           <div className="relative my-4">
    //             <div className="absolute inset-0 flex items-center">
    //               <div className="w-full border-t border-gray-300"></div>
    //             </div>
    //             <div className="relative flex justify-center text-sm">
    //               <span className="bg-white rounded-full px-4 py-1 text-base text-gray-600">
    //                 Or
    //               </span>
    //             </div>
    //           </div>

    //           {/* Google Sign-in button */}
    //           <div className="flex flex-col gap-4">
    //             <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 text-black border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-slate-200">
    //               <Image
    //                 src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
    //                 alt="google_logo"
    //                 width={20}
    //                 height={20}
    //               />
    //               <span className="text-base font-semibold ">
    //                 Sign In with Google
    //               </span>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Sign-up link */}
    //         <div className="text-center flex items-center gap-2 justify-center text-gray-900 text-base font-medium">
    //           <Link
    //             href="/auth/sign-up"
    //             className="font-semibold text-primary-400"
    //           >
    //             Sign Up
    //           </Link>
    //           <p className="text-slate-600">if you don't have an account yet</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col w-1/2 h-full bg-white">
        <div className="flex items-center mt-6 ml-6">
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
              Sign in to your account
            </h1>
            <button className="w-full flex justify-center items-center gap-2 cursor-pointer text-base py-4 font-normal leading-6 rounded-full text-black border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
              <Image
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              <span className="text-base font-semibold">
                Continue with Google
              </span>
            </button>
            <div className="flex items-center w-full mt-8 mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-sm font-bold text-gray-500">
                OR LOG IN WITH YOUR EMAIL
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <form className="flex flex-col w-full mt-3">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="text-left text-base font-bold leading-6 mb-2"
                >
                  Email address
                </label>
                <div className="text-lg font-normal bg-gray-100 leading-7 pl-6 pr-5 py-4 rounded-md flex items-center justify-center gap-3">
                  <MdOutlineEmail className="w-7 h-7" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@gmail.com"
                    className="outline-none w-full bg-transparent"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col w-full mt-2">
                <label
                  htmlFor="password"
                  className="text-left text-base font-bold leading-6 mb-2"
                >
                  Password
                </label>
                <div className="text-lg font-normal bg-gray-100 leading-7 pl-6 pr-5 py-[14px] rounded-md flex items-center justify-center gap-3">
                  <MdOutlineLock className="w-8 h-8" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="outline-none bg-transparent w-full"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <ImEye className="w-6 h-6" />
                    ) : (
                      <ImEyeBlocked className="w-6 h-6" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-left text-sm leading-6 font-normal text-[#004AADFF] mt-2 hover:underline"
              >
                Forgot password?
              </Link>
              <button
                onClick={handleSignInClick}
                className="w-full bg-primary-600 text-white text-base font-semibold py-4 mt-4 rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!isValidForm || isLoading}
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
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="absolute flex gap-1 bottom-8 left-1/4 transform -translate-x-1/2 font-bold text-sm text-gray-600">
          <span>Don't have an account yet?</span>
          <Link
            href="/auth/sign-up"
            className="text-primary-400 hover:underline"
          >
            Sign Up
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

export default SignIn;
