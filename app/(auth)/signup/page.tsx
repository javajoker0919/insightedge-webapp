"use client";

import Image from "next/image";
import AuthInput from "@/components/SignInput";
import { useContext, useEffect, useState } from "react";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import { UserContext } from "@/contexts/userContext";
import { useToastContext } from "@/contexts/toastContext";
import Link from "next/link";

const SignUp = () => {
  const { validateUserName, validateEmail, validatePassword } = useValidation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const { invokeToast } = useToastContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  useEffect(() => {
    if (firstName && lastName && email && password === confirmPass) {
      if (
        error.firstName ||
        error.lastName ||
        error.email ||
        error.password ||
        error.confirmPass
      ) {
        setIsValidate(false);
        return;
      } else {
        setIsValidate(true);
      }
    } else {
      setIsValidate(false);
    }
  }, [error, email, password, confirmPass, firstName, lastName]);

  const handleValidation = (error: any, validate: any, feild: any) => {
    setError((prevstate: any) =>
      !validate
        ? { ...prevstate, [feild]: error }
        : { ...prevstate, [feild]: "" }
    );
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: firstName + " " + lastName,
        },
        emailRedirectTo: "http://localhost:3000/",
      },
    });
    if (error) {
      invokeToast("error", "Something went wrong!", "top");
    } else {
      const { error } = await supabase
        .from("users")
        .insert({ email: email, name: firstName + " " + lastName });
      if (!error) {
        setUserInfo(data.user?.user_metadata);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(data.user?.user_metadata)
        );
        invokeToast("success", "Please confirm your inbox and sign in!", "top");
      } else {
        invokeToast("error", "Something went wrong!", "top");
      }
    }
  };
  return (
    <div className="bg-white w-full h-full">
      <div className="flex flex-col lg:flex-row justify-center h-[calc(100vh-4.5rem)]">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            <div className="md:w-[400px] w-full md:m-auto shadow-indigo-200 rounded-xl md:shadow-2xl md:p-8">
              <header className="text-center mb-8">
                <h2 className="text-gray-900 text-2xl font-semibold mb-2">
                  Create your account
                </h2>
              </header>

              {/* Email & Password Log In */}
              <form onSubmit={() => {}} className="flex flex-col gap-5">
                {/* Email Field */}
                <div className="space-y-1">
                  <p className="text-slate-600">Email</p>
                  <AuthInput
                    error={error.email ? error.email : ""}
                    type="email"
                    onChange={(e: any) => {
                      const { validate, error } = validateEmail(e.target.value);
                      handleValidation(error, validate, "email");
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex w-full justify-between items-center">
                    <p className="text-slate-600">Password</p>
                    <p
                      onClick={() => {}}
                      className="modal-open cursor-pointer text-success-300 font-semibold text-sm text-indigo-500"
                    >
                      Forgot Password?
                    </p>
                  </div>
                  <AuthInput
                    error={error.password ? error.password : ""}
                    type="password"
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      const { validate, error } = validatePassword(
                        e.target.value
                      );
                      handleValidation(error, validate, "password");
                    }}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <p className="text-slate-600">Confirm Password</p>

                  <AuthInput
                    error={error.password ? error.password : ""}
                    type="password"
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      const { validate, error } = validatePassword(
                        e.target.value
                      );
                      handleValidation(error, validate, "password");
                    }}
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

                {/* Sign Up Button */}
                <button className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-indigo-600 hover:bg-indigo-700">
                  Sign Up
                </button>
              </form>

              {/* Social Sign Up */}
              <div className="flex flex-col gap-4 mt-4">
                {/* Google Sign Up */}
                <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 text-black border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-slate-200">
                  <Image
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="google_logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-base font-semibold ">
                    {"Sign Up with Google"}
                  </span>
                </div>

                {/* Apple Sign Up */}
                {/* <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 text-black border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-slate-200">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    alt="apple_logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-base font-semibold">
                    {"Sign In with Apple"}
                  </span>
                </div> */}
              </div>
            </div>

            <div className="text-center flex items-center gap-2 justify-center text-gray-900 text-base font-medium">
              <Link href={"/signin"} className="font-semibold text-indigo-400">
                Sign In
              </Link>

              <p className="text-slate-600">
                if you already have an account yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
