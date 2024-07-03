"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { UserContext } from "@/contexts/userContext";
import { useToastContext } from "@/contexts/toastContext";
import useValidation from "@/hooks/useValidation";
import AuthInput from "@/app/components/SignInput";

const SignUp = () => {
  /// Custom hooks for validation and context
  const { validateEmail, validatePassword } = useValidation();
  const { setUserInfo } = useContext(UserContext);
  const { invokeToast } = useToastContext();

  /// State for form data and errors
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });

  /// State to track form validation
  const [isValidate, setIsValidate] = useState(false);

  /// Effect to check form validity
  useEffect(() => {
    const { email, password, confirmPass } = formData;
    const hasErrors = Object.values(errors).some((error) => error !== "");
    const allFieldsFilled = Boolean(email && password && confirmPass);
    const passwordsMatch = password === confirmPass;

    setIsValidate(allFieldsFilled && !hasErrors && passwordsMatch);
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

  /// Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    /// Sign up user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/",
      },
    });

    if (error) {
      invokeToast("error", "Something went wrong!", "top");
    } else {
      console.log(data.user?.id);

      /// Insert user data into 'users' table
      const { error: userError } = await supabase
        .from("users")
        .insert({ id: data.user?.id });

      if (!userError) {
        setUserInfo(data.user?.user_metadata);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(data.user?.user_metadata)
        );
        invokeToast("success", "Successfully signed up!", "top");
      } else {
        invokeToast("error", "Something went wrong!", "top");
      }
    }
  };

  return (
    <div className="bg-white w-full h-screen">
      <div className="flex flex-col lg:flex-row justify-center h-full">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            <div className="md:w-[400px] w-full md:m-auto shadow-indigo-200 rounded-xl md:shadow-2xl md:p-8">
              <header className="text-center mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold mb-2">
                  Create your account
                </h2>
              </header>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                <div className="space-y-1">
                  <p className="text-slate-600">Email</p>
                  <AuthInput
                    name="email"
                    type="email"
                    error={errors.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600">Password</p>
                  <AuthInput
                    name="password"
                    type="password"
                    error={errors.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-slate-600">Confirm Password</p>
                  <AuthInput
                    name="confirmPass"
                    type="password"
                    error={errors.confirmPass}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    className="w-5 h-5 focus:ring-transparent rounded-full border border-bgray-300 focus:accent-success-300 text-success-300"
                    id="remember"
                    type="checkbox"
                    name="remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-slate-600 text-base flex flex-col items-center"
                  >
                    <p>By creating an account, you agree to our</p>
                    <span className="text-indigo-500 font-semibold">
                      Terms of Use
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!isValidate}
                  className="py-3.5 mt-2 flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 transition-all rounded-lg w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Sign Up
                </button>
              </form>

              <div className="flex flex-col gap-4 mt-4">
                <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 text-black border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-slate-200">
                  <Image
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="google_logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-base font-semibold ">
                    Sign Up with Google
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center flex items-center gap-2 justify-center text-gray-900 text-base font-medium">
              <Link
                href="/auth/sign-in"
                className="font-semibold text-indigo-400"
              >
                Sign In
              </Link>
              <p className="text-slate-600">if you already have an account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
