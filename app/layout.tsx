import type { Metadata } from "next";
import { PrelineScript } from "./components";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import ToastProvider from "@/contexts/toastContext";
import AuthProvider from "@/contexts/AuthProvider";

export const metadata: Metadata = {
  title: "ProspectEdge: AI-Powered Sales Account Planning",
  description:
    "Boost B2B sales with our AI-driven sales intelligence & engagement platform. Get earnings call transcripts database & insights on customers, markets, & trends.",
  openGraph: {
    url: "https://prospectedge.co/",
    type: "website",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals.",
    siteName: "ProspectEdge",
    images: ["/logo_full.jpg?fit=max"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prospectedge",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals.",
    images: "/logo_full.jpg?fit=max",
  },
  alternates: {
    canonical: "https://prospectedge.co/",
  },
  metadataBase: new URL("https://prospectedge.co/"),
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-537W4DTR');
          `}
        </Script>
      </head>
      <body className="text-black">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-537W4DTR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <div className="flex h-full min-h-screen flex-col items-center justify-between bg-white">
          <AuthProvider>
            <ToastProvider>
              <ToastContainer {...ToastContainerConfig} />
              {children}
            </ToastProvider>
          </AuthProvider>
        </div>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ProspectEdge",
              alternateName: "ProspectEdge",
              url: "https://prospectedge.co/",
              logo: "/logo_full.jpg?fit=max",
            }),
          }}
        />
      </body>
      <PrelineScript />
    </html>
  );
}
