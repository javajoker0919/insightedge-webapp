import Image from "next/image";
import Link from "next/link";
import { MdMarkEmailRead } from "react-icons/md";
import HeaderImage from "@/app/components/HeaderImage";

const VerifyEmail = () => {
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col items-center justify-center w-1/2 h-full bg-white z-10">
        <HeaderImage />
        <div className="flex flex-col items-center">
          <div className="max-w-md w-full px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Verify your email
            </h1>
            <div className="flex items-center justify-center mb-8">
              <MdMarkEmailRead className="text-6xl text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm font-normal leading-6 mb-8 text-center w-full">
              An email has been sent to <span className="font-semibold">example.email@gmail.com</span> with a link to
              verify your account. If you don't see the email, please check
              your spam folder before clicking "Resend".
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold w-full py-4 rounded transition duration-300 ease-in-out">
              Resend email
            </button>
            <div className="flex justify-center mt-6 text-sm gap-1 font-bold">
              <span className="text-gray-600">Need some help?</span>
              <Link href="/support" className="text-blue-600 hover:text-blue-800 ml-1 font-semibold">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 w-1/2 h-full relative">
        <Image
          src="/icons/verify-2.svg"
          width={358}
          height={264}
          alt="Welcome illustration"
          className="absolute top-[180px] -left-16"
        />
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 rounded-[50%] bg-gray-200 w-[600px] h-[8.5rem] z-0"></div>
            <Image
              src="/icons/verify-1.svg"
              width={431}
              height={342}
              alt="Welcome illustration"
              className="relative z-10 scale-x-[-1] bottom-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
