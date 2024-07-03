import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "InsightEdge: AI-Powered Sales Insights for B2B Teams",
  description:
    "Boost your B2B sales with InsightEdge's AI-powered insights. Get real-time data on customers, markets, and trends to close more deals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
