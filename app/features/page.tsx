import { Metadata } from "next/types";

import FeaturePageSection from "@/app/components/feature/FeaturePageSection";

export const metadata: Metadata = {
  title: "Enhance Your Sales Strategy with ProspectEdge's Features",
  description:
    "Boost B2B sales with our AI-driven sales intelligence & engagement platform. Get earnings call transcripts database & insights on customers, markets, & trends.",
  openGraph: {
    url: "https://prospectedge.co/",
    type: "website",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Explore ProspectEdge's key features, crafted to enhance your sales strategy and drive business growth. Discover advanced solutions by signing up today!",
    siteName: "ProspectEdge",
    images: ["/logo_full.jpg?fit=max"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prospectedge",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Explore ProspectEdge's key features, crafted to enhance your sales strategy and drive business growth. Discover advanced solutions by signing up today!",
    images: "/logo_full.jpg?fit=max",
  },
  alternates: {
    canonical: "https://prospectedge.co/features",
  },
  metadataBase: new URL("https://prospectedge.co/"),
};

const FeaturePage = () => {
  return <FeaturePageSection />;
};

export default FeaturePage;
