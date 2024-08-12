"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderImage from "@/app/components/HeaderImage";

const ResetSuccess = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <HeaderImage />
      <div className="flex flex-col items-center text-center max-w-[596px] w-full px-10">
        <Image
          alt="Reset Success"
          src="/image/reset-success.svg"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-[40px] leading-[56px] font-bold text-[#323743FF]">
          Password changed!
        </h1>
        <p className="text-sm font-normal leading-6 text-[#9095A1FF]">
          Your password has been changed successfully!.
        </p>
        <div className="w-full mt-8">
          <button
            type="button"
            className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-lg font-medium py-4 rounded-full transition duration-300 ease-in-out shadow-md"
            onClick={() => router.replace("/auth/sign-in")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetSuccess;
