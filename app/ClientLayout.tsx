"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import ToastProvider from "@/contexts/toastContext";
import AuthProvider from "@/contexts/AuthProvider";

const AUTH_PAGES = [
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
];

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
    <div className="flex h-full min-h-screen flex-col items-center justify-between bg-white">
      <AuthProvider>
        <ToastProvider>
          <ToastContainer {...ToastContainerConfig} />
          {children}
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}
