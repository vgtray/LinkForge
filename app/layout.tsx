import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const cabinetGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cabinet",
});

const satoshi = DM_Sans({
  subsets: ["latin"],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: {
    template: "%s | LinkForge",
    default: "LinkForge",
  },
  description: "Your links. Your brand. One page.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${cabinetGrotesk.variable} ${satoshi.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
