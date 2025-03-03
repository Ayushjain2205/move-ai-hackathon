"use client";
import type React from "react";
import { ThirdwebProvider } from "thirdweb/react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
