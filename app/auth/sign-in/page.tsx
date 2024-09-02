"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  profileAtom,
  watchlistAtom,
} from "@/utils/atoms";
import { Logo } from "@/app/components";
import { getMixPanelClient } from "@/utils/mixpanel";

const SignIn = () => {
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const setUserMetadata = useSetAtom(userMetadataAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const setOrgInfo = useSetAtom(orgInfoAtom);
  const setProfile = useSetAtom(profileAtom);
  const setWatchlist = useSetAtom(watchlistAtom);
  const mixpanel = getMixPanelClient();

  const { validateEmail, validatePassword } = useValidation();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isValidForm, setIsValidForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const { email, password } = credentials;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    setIsValidForm(!!email && !!password && !hasErrors);
  }, [credentials, errors]);

  const handleInputChange = (field: "email" | "password", value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    const { validate, error } =
      field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: validate ? "" : error }));
  };

  const handleSignInClick = async () => {
    const { email, password } = credentials;

    if (!isValidForm || !email || !password) {
      setErrors({
        email: validateEmail(email).error,
        password: validatePassword(password).error,
      });
      invokeToast("error", "Please fill in all fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setUserMetadata(data.user?.user_metadata || null);

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user?.id)
        .maybeSingle();

      if (userDataError) throw userDataError;

      if (!userData) {
        router.replace("/onboarding");
        return;
      }

      setUserInfo({
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        companyName: "",
      });

      invokeToast("success", "You have successfully logged in!");

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

      setProfile({
        user_id: userData.id,
        org_id: orgData.id,
        credits: null,
      });

      mixpanel.identify(userData.id); // Identify user in Mixpanel
      mixpanel.track("Sign In", { email: userData.email }); // Track sign-in event

      setOrgInfo({
        id: orgData.id,
        name: orgData.name,
        website: orgData.website,
        overview: orgData.overview,
        products: orgData.products,
        creatorID: orgData.creator_id,
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
            company_count: item.watchlist_companies?.length,
          };
        })
      );

      router.replace(`/app/watchlist/${watchlistData[0].uuid}`);
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error.message === "Invalid login credentials") {
        invokeToast("error", "Please confirm your email and password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row w-full h-screen">
      <div className="flex flex-col w-full xl:w-1/2 bg-white">
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
        <div className="flex flex-col mt-8 md:mt-24 items-center w-full px-4 md:px-0">
          <div className="flex flex-col w-full max-w-[26rem] text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
              Sign in to your account
            </h1>
            <button
              className="w-full flex justify-center items-center gap-2 cursor-pointer text-sm md:text-base py-3 md:py-4 font-normal leading-6 rounded-full text-black border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              <span className="text-sm md:text-base font-semibold">
                Continue with Google
              </span>
            </button>
            <div className="flex items-center w-full mt-6 mb-4 md:mt-8 md:mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-2 md:mx-4 text-xs md:text-sm font-bold text-gray-500">
                OR LOG IN WITH YOUR EMAIL
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <form className="flex flex-col w-full mt-3">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="text-left text-sm md:text-base font-bold leading-6 mb-2"
                >
                  Email address
                </label>
                <div className="text-base md:text-lg font-normal bg-gray-100 leading-7 pl-4 md:pl-6 pr-3 md:pr-5 py-3 md:py-4 rounded-md flex items-center justify-center gap-2 md:gap-3">
                  <MdOutlineEmail className="w-6 h-6 md:w-7 md:h-7" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example.email@gmail.com"
                    className="outline-none w-full bg-transparent text-sm md:text-base"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full mt-2">
                <label
                  htmlFor="password"
                  className="text-left text-sm md:text-base font-bold leading-6 mb-2"
                >
                  Password
                </label>
                <div className="text-base md:text-lg font-normal bg-gray-100 leading-7 pl-4 md:pl-6 pr-3 md:pr-5 py-3 md:py-[14px] rounded-md flex items-center justify-center gap-2 md:gap-3">
                  <MdOutlineLock className="w-6 h-6 md:w-8 md:h-8" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="outline-none bg-transparent w-full text-sm md:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <ImEye className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <ImEyeBlocked className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-left text-xs md:text-sm leading-6 font-normal text-[#004AADFF] mt-2 hover:underline"
              >
                Forgot password?
              </Link>
              <button
                type="button"
                onClick={handleSignInClick}
                className="w-full bg-primary-600 text-white text-sm md:text-base font-semibold py-3 md:py-4 mt-4 rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 md:h-6 md:w-6 text-white"
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
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="flex gap-1 mt-8 mb-4 xl:absolute xl:bottom-8 xl:left-1/4 xl:transform xl:-translate-x-1/2 font-bold text-xs xl:text-sm text-gray-600 justify-center">
          <span>Don't have an account yet?</span>
          <Link
            href="/auth/sign-up"
            className="text-primary-400 hover:underline"
          >
            Sign Up
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

export default SignIn;
