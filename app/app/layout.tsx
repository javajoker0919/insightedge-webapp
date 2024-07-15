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
    <div className="w-full h-full flex-grow max-w-full flex">
      <Sidebar />
      <div className="flex overflow-hidden flex-1 flex-col max-h-screen">
        <Header />
        <div className="flex overflow-y-auto flex-1 text-black">{children}</div>
      </div>
    </div>
  );
}
