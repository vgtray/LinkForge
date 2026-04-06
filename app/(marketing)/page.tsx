"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeatureCards from "@/components/landing/FeatureCards";
import DemoPreview from "@/components/landing/DemoPreview";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero3D = dynamic(() => import("@/components/landing/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#3B82F6]/5 to-transparent" />
  ),
});

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-[var(--lf-text-secondary)]">
          Scroll
        </span>
        <div className="relative h-10 w-[1px] overflow-hidden bg-[#27272A]">
          <div className="animate-scroll-line absolute left-0 top-0 h-4 w-full bg-[var(--lf-accent)]" />
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      // Word-by-word reveal: each [data-word] is an overflow-hidden wrapper
      const wordWrappers =
        titleRef.current!.querySelectorAll("[data-word]");
      const innerSpans: HTMLElement[] = [];

      wordWrappers.forEach((wrapper) => {
        const inner = wrapper.querySelector("span");
        if (inner) innerSpans.push(inner);
      });

      gsap.fromTo(
        innerSpans,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.7,
          stagger: 0.03,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 }
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.1 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const renderLine = (text: string, className?: string) => {
    const words = text.split(" ");
    return (
      <span className={`block ${className || ""}`}>
        {words.map((word, i) => (
          <span
            key={i}
            data-word
            className="inline-block overflow-hidden"
          >
            <span className="inline-block">
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </span>
    );
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-20"
      style={{ padding: "0 var(--lf-pad-x)" }}
    >
      <Hero3D />

      <div className="relative z-10 max-w-5xl">
        <h1
          ref={titleRef}
          className="font-display font-extrabold uppercase text-[var(--lf-text-primary)]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
          }}
        >
          {renderLine("YOUR LINKS.")}
          {renderLine("YOUR BRAND.")}
          {renderLine(
            "ONE PAGE.",
            "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent"
          )}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 max-w-md text-lg text-[var(--lf-text-secondary)] opacity-0"
        >
          Build your premium link-in-bio page in minutes. Stand out from the
          crowd.
        </p>

        <div
          ref={ctaRef}
          className="mt-8 flex flex-col items-start gap-4 opacity-0 sm:flex-row sm:items-center"
        >
          <Link
            href="/register"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-8 py-4 text-base font-semibold text-white transition-shadow hover:shadow-[0_0_24px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
          >
            Create your page &mdash; it&apos;s free
          </Link>
          <a
            href="#features"
            className="text-sm text-[var(--lf-text-secondary)] transition-colors hover:text-[var(--lf-text-primary)]"
          >
            See how it works &darr;
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#09090B] to-transparent" />

      <ScrollIndicator />
    </section>
  );
}

export default function MarketingPage() {
  return (
    <main className="bg-[#09090B]">
      <HeroSection />

      <div id="features" style={{ paddingBlock: "var(--lf-space-section)" }}>
        <FeatureCards />
      </div>

      <div style={{ paddingBlock: "var(--lf-space-section)" }}>
        <DemoPreview />
      </div>

      <div style={{ paddingBlock: "var(--lf-space-section)" }}>
        <Testimonials />
      </div>

      <div style={{ paddingBlock: "var(--lf-space-section)" }}>
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
