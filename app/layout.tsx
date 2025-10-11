import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "@/contexts/config-context";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Inmobiliaria Poire - Propiedades de Lujo",
  description:
    "Encuentra tu propiedad ideal con nuestra selección exclusiva de inmuebles premium",
  generator: "v0.app",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${manrope.variable} antialiased`}
    >
      <body className="font-sans">
        <ConfigProvider>{children}</ConfigProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
