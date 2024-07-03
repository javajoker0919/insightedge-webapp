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

const AUTH_PAGES = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"];

const ToastContainerConfig = {
  closeOnClick: true,
  draggable: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  autoClose: 3000,
  hideProgressBar: true,
  newestOnTop: false,
  position: "top-right" as const,
  theme: "colored" as const,
};

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname);

  return (
    <div className="flex h-screen flex-col items-center justify-between bg-white">
      <UserProvider>
        <AuthProvider>
          <ToastProvider>
            <ToastContainer {...ToastContainerConfig} />
            {isAuthPage ? (
              children
            ) : (
              <>
                <Navbar />
                {children}
                <Footer />
              </>
            )}
          </ToastProvider>
        </AuthProvider>
      </UserProvider>
    </div>
  );
}
