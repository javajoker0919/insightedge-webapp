import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import PrelineScript from "./app/components/PrelineScript";

export const metadata: Metadata = {
  title: "ProspectEdge: AI-Powered Sales Insights for B2B Teams",
  description:
    "Boost your B2B sales with ProspectEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-black">
        <ClientLayout>{children}</ClientLayout>
      </body>
      <PrelineScript />
    </html>
  );
}
