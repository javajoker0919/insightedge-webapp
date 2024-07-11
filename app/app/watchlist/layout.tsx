import React from "react";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex-grow flex flex-col">
      <Header />
      {children}
    </div>
  );
}
