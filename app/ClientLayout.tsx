"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { UserProvider } from "../contexts/userContext";
import ToastProvider from "@/contexts/toastContext";
import AuthProvider from "@/contexts/AuthProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = ["/auth/sign-in", "/auth/sign-up"].includes(pathname);

  return (
    <div className="flex h-full flex-col items-center justify-between">
      <UserProvider>
        <AuthProvider>
          <ToastProvider>
            <ToastContainer
              closeOnClick
              draggable
              pauseOnFocusLoss
              pauseOnHover
              autoClose={3000}
              hideProgressBar
              newestOnTop={false}
              position="top-right"
              theme="colored"
            />
            {!isAuthPage && (
              <>
                <Navbar />
                {children}
                <Footer />
              </>
            )}
            {isAuthPage && children}
          </ToastProvider>
        </AuthProvider>
      </UserProvider>
    </div>
  );
}
