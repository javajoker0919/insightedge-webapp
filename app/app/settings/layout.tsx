import React from "react";
import Sidebar from "./components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex divide-x">
      <Sidebar />

      <div className="flex overflow-y-auto flex-1 text-black">{children}</div>
    </div>
  );
}
