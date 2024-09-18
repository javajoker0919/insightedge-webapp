import { Metadata } from "next/types";

import BlogPageSection from "../components/blog/BlogPageSection";

export const metadata: Metadata = {
  title: "ProspectEdge Blog: Insights, Tips, and Industry Updates",
  description:
    "Boost B2B sales with our AI-driven sales intelligence & engagement platform. Get earnings call transcripts database & insights on customers, markets, & trends.",
  openGraph: {
    url: "https://prospectedge.co/",
    type: "website",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Explore insights and tips on marketing, business strategies, and more on the ProspectEdge blog. Stay updated with the latest industry trends and advice.",
    siteName: "ProspectEdge",
    images: ["/logo_full.jpg?fit=max"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@prospectedge",
    title: "ProspectEdge: AI Sales Account Planning",
    description:
      "Explore insights and tips on marketing, business strategies, and more on the ProspectEdge blog. Stay updated with the latest industry trends and advice.",
    images: "/logo_full.jpg?fit=max",
  },
  alternates: {
    canonical: "https://prospectedge.co/blog",
  },
  metadataBase: new URL("https://prospectedge.co/"),
};

const BlogPage: React.FC = () => {
  return <BlogPageSection />;
};

export default BlogPage;
