import '@/app/ui/global.css';

import type { Metadata } from "next";
import { poppins } from "@/app/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "React GraphQl Ham License App",
  description: "Generated by Michael J. Fox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black antialiased`}>{children}</body>
    </html>
  );
}
