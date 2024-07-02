"use client";

import AuthInput from "@/components/SignInput";
import useValidation from "@/app/hooks/useValidation";
import { supabase } from "@/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/contexts/toastContext";
import { useUserContext } from "@/contexts/userContext";

const SignIn = () => {
  const router = useRouter();
  const { invokeToast } = useToastContext();
  const { isAuth, setIsAuth } = useUserContext();

  const { validateUserName, validateEmail, validatePassword } = useValidation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidate, setIsValidate] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (email && password) {
      if (error.email || error.password) {
        setIsValidate(false);
        return;
      } else {
        setIsValidate(true);
      }
    } else {
      setIsValidate(false);
    }
  }, [error, email, password]);

  const handleValidation = (error: any, validate: any, feild: any) => {
    setError((prevstate: any) =>
      !validate
        ? { ...prevstate, [feild]: error }
        : { ...prevstate, [feild]: "" }
    );
  };

  // const handleFormSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email: email,
  //     password: password,
  //   });
  //   if (error) {
  //     if (error.message == "Invalid login credentials") {
  //       invokeToast("error", "Please confirm your email and password", "top");
  //     }
  //   } else {
  //     setIsAuth(true);
  //     localStorage.setItem(
  //       "userInfo",
  //       JSON.stringify(data.session.user.user_metadata)
  //     );
  //     console.log("User signed in:", data);

  //     invokeToast("success", "You have successfully logged in!", "top");
  //     router.replace("/");
  //   }
  // };

  return (
    <div className="bg-white dark:bg-slate-800 w-full h-full">
      <div className="flex flex-col lg:flex-row justify-center h-[calc(100vh-4.5rem)]">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            <div className="md:w-[400px] w-full md:m-auto shadow-slate-200 dark:shadow-slate-700 rounded-xl md:shadow-2xl md:p-8">
              <header className="text-center mb-8">
                <h2 className="text-gray-900 dark:text-white text-2xl font-semibold mb-2">
                  Sign in to your account
                </h2>
              </header>

              {/* Email & Password Log In */}
              <form onSubmit={() => {}} className="flex flex-col gap-5">
                {/* Email Field */}
                <div className="space-y-1">
                  <p className="text-slate-600 dark:text-slate-300">Email</p>
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
                    <p className="text-slate-600 dark:text-slate-300">
                      Password
                    </p>
                    <p
                      onClick={() => router.push("/resetpassword")}
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

                {/* Sign In Button */}
                <button className="py-3.5 mt-2 flex items-center justify-center text-white bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-indigo-600 hover:bg-indigo-700">
                  Sign In
                </button>
              </form>

              {/* -- OR -- */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-slate-400"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-slate-800 rounded-full px-4 py-1 text-base text-gray-600 dark:text-slate-400">
                    Or
                  </span>
                </div>
              </div>

              {/* Social Log In */}
              <div className="flex flex-col gap-4">
                {/* Google Log In */}
                <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 dark:hover:text-slate-700 text-black border border-gray-300 dark:border-slate-400 rounded-lg px-4 py-3 text-base dark:text-white font-medium hover:bg-slate-200">
                  <Image
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="google_logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-base font-semibold ">
                    {"Sign In with Google"}
                  </span>
                </div>

                {/* Apple Log In */}
                {/* <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 dark:hover:text-slate-700 text-black border border-gray-300 dark:border-slate-400 rounded-lg px-4 py-3 text-base dark:text-white font-medium hover:bg-slate-200">
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

            <div className="text-center flex items-center gap-2 justify-center text-gray-900 dark:text-gray-50 text-base font-medium">
              <a className="font-semibold text-indigo-400" href="/signup">
                Sign Up
              </a>
              <p className="text-slate-600 dark:text-slate-400">
                if you dont have an account yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
