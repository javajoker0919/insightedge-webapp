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

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      if (error.message == "Invalid login credentials") {
        invokeToast("error", "Please confirm your email and password", "top");
      }
    } else {
      setIsAuth(true);
      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.session.user.user_metadata)
      );
      console.log("User signed in:", data);

      invokeToast("success", "You have successfully logged in!", "top");
      router.replace("/");
    }
  };
  return (
    <div className="bg-white dark:bg-darkblack-500 w-full">
      <div className="flex flex-col lg:flex-row justify-between min-h-screen">
        <div className="lg:w-1/2 px-5 xl:pl-12 pt-10">
          <header>
            <a className="" href="/signin">
              <div className="text-4xl font-mono font-bold text-black cursor-pointer dark:text-white">
                AI-BLOG
              </div>
            </a>
          </header>
          <div className="max-w-[450px] m-auto pt-24 pb-16">
            <header className="text-center mb-8">
              <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
                Sign in to AI-Blog.
              </h2>
              <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-bgray-50">
                Send, spend and save smarter
              </p>
            </header>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="inline-flex cursor-pointer justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-4 py-4 text-base text-bgray-900 dark:text-white font-medium hover:bg-[#F6FAFF]">
                <Image
                  src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                  alt="google_logo"
                  width={20}
                  height={20}
                />
                <span className="text-base font-semibold text-slate-700">
                  Sign In with Google
                </span>
              </div>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-6 py-4 text-base text-bgray-900 dark:text-white font-medium hover:bg-[#F6FAFF]"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                  alt="google_logo"
                  width={20}
                  height={20}
                />
                <span className="text-base font-semibold text-slate-700">
                  Sign In with Apple
                </span>
              </a>
            </div>
            <div className="relative mt-6 mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-darkblack-400"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-darkblack-500 px-2 text-base text-bgray-600">
                  Or continue with
                </span>
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <AuthInput
                  title="Email"
                  error={error.email ? error.email : ""}
                  type="email"
                  onChange={(e: any) => {
                    const { validate, error } = validateEmail(e.target.value);
                    handleValidation(error, validate, "email");
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="mb-6 relative">
                <AuthInput
                  title="Password"
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
              <div className="flex justify-between mb-7">
                <div className="flex items-center space-x-3">
                  <input
                    className="w-5 h-5 dark:bg-darkblack-500 focus:ring-transparent rounded-full border border-bgray-300 focus:accent-success-300 text-success-300"
                    id="remember"
                    type="checkbox"
                    name="remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-bgray-900 dark:text-white text-base font-semibold"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <div
                    className="modal-open cursor-pointer text-success-300 font-semibold text-base underline"
                    onClick={() => router.push("/resetpassword")}
                  >
                    Forgot Password?
                  </div>
                </div>
              </div>
              <button className="py-3.5 flex items-center justify-center text-black font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-slate-400 hover:bg-slate-100">
                Sign In
              </button>
            </form>
            <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
              Don&apos;t have an account?
              <a className="font-semibold underline" href="/signup">
                Sign Up
              </a>
            </p>
            <nav className="flex items-center justify-center flex-wrap gap-x-11 pt-24">
              <a className="text-sm text-bgray-700 dark:text-white" href="#">
                Terms &amp; Condition
              </a>
              <a className="text-sm text-bgray-700 dark:text-white" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-bgray-700 dark:text-white" href="#">
                Help
              </a>
              <a className="text-sm text-bgray-700 dark:text-white" href="#">
                English
              </a>
            </nav>
            <p className="text-bgray-600 dark:text-white text-center text-sm mt-6">
              @ 2024 AI-Blog. All Right Reserved.
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 lg:block bg-slate-200 dark:bg-darkblack-600 p-20 relative min-h-screen">
          <div className="flex flex-col pt-36 gap-8 h-full">
            <div className="">
              <Image
                className="rounded-xl shadow-2xl"
                src={`https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/signin.jpg`}
                alt="signin_bg"
                width={600}
                height={400}
              />
            </div>
            <div>
              <div className="text-center max-w-lg px-1.5 m-auto">
                <h3 className="text-bgray-900 dark:text-white font-semibold font-popins text-4xl mb-4">
                  Speady, Easy and Fast
                </h3>
                <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium">
                  We&apos;re a group of AI enthusiasts sharing our thoughts on
                  the latest AI news and trends. Start Your AI Journey Join us
                  and explore the world of Artificial Intelligence!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
