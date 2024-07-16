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
    <div className="w-screen relative h-screen flex-col flex">
      <Sidebar />

      <Header />
      <div className="flex overflow-y-auto flex-1 text-black">{children}</div>
    </div>
  );
}
