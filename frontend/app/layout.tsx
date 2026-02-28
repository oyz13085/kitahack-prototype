import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";

import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });
const _dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "MedScan - Hospital Bill Price Checker",
  description:
    "Scan your hospital bill, detect overpriced medicines, and find affordable alternatives at recommended pharmacies.",
};

export const viewport: Viewport = {
  themeColor: "#0f9b6e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
