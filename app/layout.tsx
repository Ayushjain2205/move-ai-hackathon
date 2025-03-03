"use client";

import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Grandstander, Outfit, Caveat, Poppins } from "next/font/google";
import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/client";

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
      <body>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
