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
    <div className="w-full h-full flex-grow flex flex-col">
      <Header />
      <div className="flex w-full flex-1">
        <Sidebar />
        <div className="h-full m-auto flex items-center justify-center w-full text-black">
          {children}
        </div>
      </div>
    </div>
  );
}
