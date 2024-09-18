import { Metadata } from "next/types";

import PricingPageSection from "../components/pricing/PricingPageSection";

export const metadata: Metadata = {
  title: "Explore ProspectEdge's Pricing Plans",
  description:
    "Boost B2B sales with our AI-driven sales intelligence & engagement platform. Get earnings call transcripts database & insights on customers, markets, & trends.",
  openGraph: {
    url: "https://prospectedge.co/",
    type: "website",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Explore competitive pricing options of ProspectEdge AI platform. Find the perfect plan to meet your needs and budget. Contact us for more details.",
    siteName: "ProspectEdge",
    images: ["/logo_full.jpg?fit=max"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prospectedge",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Explore competitive pricing options of ProspectEdge AI platform. Find the perfect plan to meet your needs and budget. Contact us for more details.",
    images: "/logo_full.jpg?fit=max",
  },
  alternates: {
    canonical: "https://prospectedge.co/pricing",
  },
  metadataBase: new URL("https://prospectedge.co/"),
};

const PricingPage = () => {
  return <PricingPageSection />;
};

export default PricingPage;
