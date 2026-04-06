"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-5xl overflow-hidden rounded-lg"
      style={{ padding: "var(--lf-space-section) var(--lf-pad-x)" }}
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-10 opacity-15">
        <div className="gradient-mesh absolute inset-0 blur-3xl" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[#09090B]/60" />

      <div className="flex flex-col items-center text-center">
        <h2
          ref={titleRef}
          className="font-display font-bold uppercase text-[var(--lf-text-primary)]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
          }}
        >
          Ready to stand out?
        </h2>
        <div ref={contentRef}>
          <p className="mx-auto mt-6 max-w-lg text-lg text-[var(--lf-text-secondary)]">
            Join thousands of creators who chose LinkForge.
          </p>
          <Link
            href="/register"
            className="mt-10 inline-flex items-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-8 py-4 text-base font-semibold text-white transition-shadow hover:shadow-[0_0_24px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </section>
  );
}
