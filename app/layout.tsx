import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") || "electricity-receipts.local";
  const protocol = host.includes("localhost") ? "http" : "https";
  return { metadataBase: new URL(`${protocol}://${host}`), title: "房租與電費收據", description: "依房號即時產生每月租金與電費收據。", openGraph: { title: "房租與電費收據", description: "依房號即時產生每月租金與電費收據。", images: ["/og.png"] } };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
