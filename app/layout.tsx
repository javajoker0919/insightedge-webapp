import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import { PrelineScript } from "./components";
import Script from "next/script";
import Head from "next/head";

const twitterImageUrl = "https://prospectedge.co/_next/image?url=%2Ftwitter-logo-white-bg.png&w=1200&h=675&q=75";

export const metadata: Metadata = {
  title: "ProspectEdge: AI-Powered Sales Insights for B2B Teams",
  description:
    "Boost B2B sales with our AI-driven sales intelligence & engagement platform. Get earnings call transcripts database & insights on customers, markets, & trends.",
  openGraph: {
    url: "https://prospectedge.co/",
    type: "website",
    title: "ProspectEdge: AI-Powered Sales Insights for B2B Teams",
    description:
      "Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals.",
    images: [
      { url: twitterImageUrl, width: 1200, height: 675 }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@prospectedge",
    title: "ProspectEdge: AI-Powered Sales Insights for B2B Teams",
    description:
      "Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals.",
    images: [twitterImageUrl]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta property="og:url" content="https://prospectedge.co/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="ProspectEdge: AI-Powered Sales Insights for B2B Teams"
        />
        <meta
          property="og:description"
          content="Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals."
        />
        <meta
          property="og:image"
          content={twitterImageUrl}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="prospectedge.co" />
        <meta property="twitter:url" content="https://prospectedge.co/" />
        <meta
          name="twitter:title"
          content="ProspectEdge: AI-Powered Sales Insights for B2B Teams"
        />
        <meta
          name="twitter:description"
          content="Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals."
        />
        <meta
          name="twitter:image"
          content={twitterImageUrl}
        />
        <meta name="twitter:image:alt" content="Prospect Edge Logo" />
        <link rel="canonical" href="https://prospectedge.co/" />

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
              logo: twitterImageUrl
            })
          }}
        />
      </Head>
      <body className="text-black">
        <ClientLayout>{children}</ClientLayout>
      </body>
      <PrelineScript />
    </html>
  );
}
