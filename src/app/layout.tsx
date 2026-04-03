import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StarDeFi AI - AI-powered DeFi Assistant for Stellar",
  description:
    "Interact with Stellar DeFi protocols through natural language chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
