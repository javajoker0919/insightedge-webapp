"use client";

import Image from "next/image";
import AuthInput from "@/components/SignInput";
import { useContext, useEffect, useState } from "react";
import useValidation from "@/app/hooks/useValidation";
import { supabase } from "@/supabase";
import { UserContext } from "@/contexts/userContext";
import { useToastContext } from "@/contexts/toastContext";

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
    <div className="bg-white dark:bg-slate-800 w-full h-full">
      <div className="flex flex-col lg:flex-row justify-center h-[calc(100vh-4.5rem)]">
        <div className="h-full px-5 flex items-center justify-center">
          <div className="flex flex-col gap-8 mb-16">
            <div className="md:w-[400px] w-full md:m-auto shadow-indigo-200 dark:shadow-slate-700 rounded-xl md:shadow-2xl md:p-8">
              <header className="text-center mb-8">
                <h2 className="text-gray-900 dark:text-white text-2xl font-semibold mb-2">
                  Create your account
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
                  <p className="text-slate-600 dark:text-slate-300">
                    Confirm Password
                  </p>

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
                    className="w-5 h-5 dark:bg-darkblack-500 focus:ring-transparent rounded-full border border-bgray-300 focus:accent-success-300 text-success-300"
                    id="remember"
                    type="checkbox"
                    name="remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-slate-600 dark:text-white text-base flex flex-col items-center"
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
                <div className="inline-flex w-full cursor-pointer justify-center items-center gap-x-2 dark:hover:text-slate-700 text-black border border-gray-300 dark:border-slate-400 rounded-lg px-4 py-3 text-base dark:text-white font-medium hover:bg-slate-200">
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
              <a className="font-semibold text-indigo-400" href="/signin">
                Sign In
              </a>
              <p className="text-slate-600 dark:text-slate-400">
                if you already have an account yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="bg-white dark:bg-darkblack-500 w-full">
    //   <div className="flex flex-col lg:flex-row justify-between min-h-screen">
    //     <div className="lg:w-1/2 px-5 xl:pl-12 pt-10">
    //       <header>
    //         <a className="" href="/">
    //           <div className="text-4xl font-mono font-bold text-black cursor-pointer dark:text-white">
    //             Insightedge
    //           </div>
    //         </a>
    //       </header>
    //       <div className="max-w-[450px] m-auto pt-24 pb-16">
    //         <header className="text-center mb-8">
    //           <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
    //             Sign in to AI-Blog.
    //           </h2>
    //           <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-bgray-50">
    //             Send, spend and save smarter
    //           </p>
    //         </header>
    //         <div className="flex flex-col md:flex-row gap-4">
    //           <div className="inline-flex cursor-pointer justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-4 py-4 text-base text-bgray-900 dark:text-white font-medium hover:bg-[#F6FAFF]">
    //             <Image
    //               src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
    //               alt="google_logo"
    //               width={20}
    //               height={20}
    //             />
    //             <span className="text-base font-semibold text-slate-700">
    //               Sign In with Google
    //             </span>
    //           </div>
    //           <a
    //             href="#"
    //             className="inline-flex cursor-pointer justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-6 py-4 text-base text-bgray-900 dark:text-white font-medium hover:bg-[#F6FAFF]"
    //           >
    //             <Image
    //               src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    //               alt="google_logo"
    //               width={20}
    //               height={20}
    //             />
    //             <span className="text-base font-semibold text-slate-700">
    //               Sign In with Apple
    //             </span>
    //           </a>
    //         </div>
    //         <div className="relative mt-6 mb-5">
    //           <div className="absolute inset-0 flex items-center">
    //             <div className="w-full border-t border-gray-300 dark:border-darkblack-400"></div>
    //           </div>
    //           <div className="relative flex justify-center text-sm">
    //             <span className="bg-white dark:bg-darkblack-500 px-2 text-base text-bgray-600">
    //               Or continue with
    //             </span>
    //           </div>
    //         </div>
    //         <form onSubmit={handleFormSubmit}>
    //           <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
    //             <div>
    //               <AuthInput
    //                 title="First Name"
    //                 error={error.firstName ? error.firstName : ""}
    //                 type="text"
    //                 onChange={(e: any) => {
    //                   setFirstName(e.target.value);
    //                   const { validate, error } = validateUserName(
    //                     e.target.value
    //                   );
    //                   handleValidation(error, validate, "name");
    //                 }}
    //               />
    //             </div>
    //             <div>
    //               <AuthInput
    //                 title="Last Name"
    //                 error={error.lastName ? error.lastName : ""}
    //                 type="text"
    //                 onChange={(e: any) => {
    //                   setLastName(e.target.value);
    //                   const { validate, error } = validateUserName(
    //                     e.target.value
    //                   );
    //                   handleValidation(error, validate, "name");
    //                 }}
    //               />
    //             </div>
    //           </div>
    //           <div className="mb-4">
    //             <AuthInput
    //               title="Email"
    //               error={error.email ? error.email : ""}
    //               type="email"
    //               onChange={(e: any) => {
    //                 const { validate, error } = validateEmail(e.target.value);
    //                 handleValidation(error, validate, "email");
    //                 setEmail(e.target.value);
    //               }}
    //             />
    //           </div>
    //           <div className="mb-6 relative">
    //             <AuthInput
    //               title="Password"
    //               error={error.password ? error.password : ""}
    //               type="password"
    //               onChange={(e: any) => {
    //                 setPassword(e.target.value);
    //                 const { validate, error } = validatePassword(
    //                   e.target.value
    //                 );
    //                 handleValidation(error, validate, "password");
    //               }}
    //             />
    //           </div>
    //           <div className="mb-6 relative">
    //             <AuthInput
    //               title="Confirm Password"
    //               error={error.confirmPass ? error.confirmPass : ""}
    //               type="password"
    //               onChange={(e: any) => {
    //                 const { validate, error } = validatePassword(
    //                   e.target.value
    //                 );
    //                 handleValidation(error, validate, "confirmPass");
    //                 setConfirmPass(e.target.value);
    //               }}
    //             />
    //           </div>
    //           <div className="flex justify-between mb-7">
    //             <div className="flex items-center gap-x-3">
    //               <input
    //                 className="w-5 h-5 focus:ring-transparent rounded-md border border-bgray-300 focus:accent-success-300 text-success-300 dark:bg-transparent dark:border-darkblack-400"
    //                 id="remember"
    //                 type="checkbox"
    //                 name="remember"
    //               />
    //               <label
    //                 htmlFor="remember"
    //                 className="text-bgray-600 dark:text-bgray-50 text-base"
    //               >
    //                 By creating an account, you agreeing to our
    //                 <span className="text-bgray-900 dark:text-white">
    //                   Privacy Policy,
    //                 </span>{" "}
    //                 and
    //                 <span className="text-bgray-900 dark:text-white">
    //                   Electronics Communication Policy
    //                 </span>
    //                 .
    //               </label>
    //             </div>
    //           </div>
    //           <button
    //             className={`py-3.5 disabled:cursor-not-allowed disabled:hover:bg-slate-400 flex items-center justify-center text-black font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-slate-400 hover:bg-slate-100`}
    //             disabled={!isValidate}
    //           >
    //             Sign Up
    //           </button>
    //         </form>
    //         <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
    //           Already have an account?
    //           <a className="font-semibold underline" href="/signin">
    //             Sign In
    //           </a>
    //         </p>
    //         <nav className="flex items-center justify-center flex-wrap gap-x-11 pt-24">
    //           <a className="text-sm text-bgray-700 dark:text-white" href="#">
    //             Terms &amp; Condition
    //           </a>
    //           <a className="text-sm text-bgray-700 dark:text-white" href="#">
    //             Privacy Policy
    //           </a>
    //           <a className="text-sm text-bgray-700 dark:text-white" href="#">
    //             Help
    //           </a>
    //           <a className="text-sm text-bgray-700 dark:text-white" href="#">
    //             English
    //           </a>
    //         </nav>
    //         <p className="text-bgray-600 dark:text-white text-center text-sm mt-6">
    //           @ 2024 AI-Blog. All Right Reserved.
    //         </p>
    //       </div>
    //     </div>
    //     <div className="lg:w-1/2 lg:block bg-slate-200 dark:bg-darkblack-600 p-20 relative min-h-screen">
    //       <div className="flex flex-col pt-36 gap-8 h-full">
    //         <div className="">
    //           <Image
    //             className="rounded-xl shadow-2xl"
    //             src={`https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/signup.jpg`}
    //             alt="signin_bg"
    //             width={600}
    //             height={400}
    //           />
    //         </div>
    //         <div>
    //           <div className="text-center max-w-lg px-1.5 m-auto">
    //             <h3 className="text-bgray-900 dark:text-white font-semibold font-popins text-4xl mb-4">
    //               Speady, Easy and Fast
    //             </h3>
    //             <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium">
    //               We&apos;re a group of AI enthusiasts sharing our thoughts on
    //               the latest AI news and trends. Start Your AI Journey Join us
    //               and explore the world of Artificial Intelligence!
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SignUp;
