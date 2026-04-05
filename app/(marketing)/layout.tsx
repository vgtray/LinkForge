import { Metadata } from "next";
import { SmoothScroll } from "@/components/shared/SmoothScroll";

export const metadata: Metadata = {
  title: "LinkForge — Your links. Your brand. One page.",
  description:
    "Build your premium link-in-bio page in minutes. Drag & drop editor, premium themes, real-time analytics, and custom domains.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
