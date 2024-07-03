"use client";

import AuthInput from "@/components/SignInput";
import useValidation from "@/hooks/useValidation";
import { supabase } from "@/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/userContext";
import { useToastContext } from "@/contexts/toastContext";

const ResetPassword = () => {
  const router = useRouter();
  const { invokeToast } = useToastContext();

  const { setIsChangePassword, isChangePassword } = useUserContext();

  const { validateEmail, validatePassword } = useValidation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [isValidate, setIsValidate] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });

  useEffect(() => {
    if (email) {
      if (error.email) {
        setIsValidate(false);
        return;
      } else {
        setIsValidate(true);
      }
    } else {
      setIsValidate(false);
    }
  }, [error, email]);

  const handleValidation = (error: any, validate: any, feild: any) => {
    setError((prevstate: any) =>
      !validate
        ? { ...prevstate, [feild]: error }
        : { ...prevstate, [feild]: "" }
    );
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!isChangePassword) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        console.log("error", error);
      } else {
        invokeToast(
          "success",
          `We've sent the reset password link to ${email}.`,
          "top"
        );
      }
    } else {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (data) {
        invokeToast("success", `Password updated successfully!`, "top");
        router.push("/signin");
      }
      if (error)
        invokeToast(
          "error",
          `There was an error updating your password.`,
          "top"
        );
    }
  };
  return (
    <div className="bg-white dark:bg-darkblack-500 w-full">
      <div className="flex flex-col lg:flex-row justify-between min-h-screen">
        <div className="lg:w-1/2 px-5 xl:pl-12 pt-10 place-items-center">
          <header>
            <a className="" href="/resetpassword">
              <div className="text-4xl font-mono font-bold text-black cursor-pointer dark:text-white">
                Insightedge
              </div>
            </a>
          </header>
          <div className="max-w-[450px] m-auto pt-48 pb-16">
            <header className="text-center mb-8">
              <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
                {isChangePassword
                  ? "Change your password"
                  : `Reset your password`}
              </h2>
              {!isChangePassword && (
                <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-bgray-50">
                  Remember your password?
                  <a className="pl-2 underline" href="/signin">
                    Signin here
                  </a>
                </p>
              )}
            </header>
            <form onSubmit={handleFormSubmit}>
              {isChangePassword ? (
                <>
                  <div className="mb-4">
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
                  <div className="mb-4">
                    <AuthInput
                      title="Confirm Password"
                      error={error.confirmPass ? error.confirmPass : ""}
                      type="password"
                      onChange={(e: any) => {
                        const { validate, error } = validatePassword(
                          e.target.value
                        );
                        handleValidation(error, validate, "confirmPass");
                        setConfirmPass(e.target.value);
                      }}
                    />
                  </div>
                </>
              ) : (
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
              )}

              <button className="py-3.5 flex items-center justify-center text-black font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full bg-slate-400 hover:bg-slate-100">
                {isChangePassword ? "Change" : "Send"}
              </button>
            </form>
          </div>
        </div>
        <div className="lg:w-1/2 lg:block bg-slate-200 dark:bg-darkblack-600 p-20 relative min-h-screen">
          <div className="flex flex-col pt-36 gap-8 h-full">
            <div className="">
              <Image
                className="rounded-xl shadow-2xl"
                src={`https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/ivan-jevtic-B5EJm5V5gJs-unsplash.jpg`}
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

export default ResetPassword;
