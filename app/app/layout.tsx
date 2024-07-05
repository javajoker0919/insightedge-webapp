import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; // Adjust the import path
// import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {/* <Header /> */}
      <Sidebar />
      <div className="h-full flex items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}
