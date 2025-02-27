import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Grandstander, Outfit, Caveat, Poppins } from "next/font/google";

const grandstander = Grandstander({
  subsets: ["latin"],
  variable: "--font-grandstander",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "love.ai - Find Your Digital Soulmate",
  description: "Join the hottest AI dating experience in the metaverse!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${grandstander.variable} ${outfit.variable} ${caveat.variable} ${poppins.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
