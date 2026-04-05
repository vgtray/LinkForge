"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  GripVertical,
  Palette,
  BarChart3,
  Globe,
  Zap,
  Search,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FEATURES = [
  {
    title: "Drag & Drop Editor",
    description:
      "Build your page visually. Reorder links, add blocks, and customize everything with zero code.",
    icon: GripVertical,
    span: 2,
  },
  {
    title: "5 Premium Themes",
    description:
      "From minimal to brutalist. Choose a vibe that matches your brand.",
    icon: Palette,
    span: 1,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track clicks, views, and CTR. Know what your audience loves.",
    icon: BarChart3,
    span: 1,
  },
  {
    title: "Custom Domain Ready",
    description: "Use your own domain. yourname.com instead of a generic URL.",
    icon: Globe,
    span: 1,
  },
  {
    title: "Lightning Fast",
    description: "Sub-100ms load times. No spinners, no waiting. Just speed.",
    icon: Zap,
    span: 1,
  },
  {
    title: "SEO Optimized",
    description:
      "Custom meta tags, Open Graph images, and clean URLs. Get found everywhere.",
    icon: Search,
    span: 2,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    },
    []
  );

  const Icon = feature.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      data-feature-card
      data-index={index}
      className={`spotlight group relative rounded-lg border border-[#27272A] bg-[#18181B] p-8 transition-colors hover:border-[#3B82F6]/20 ${
        feature.span === 2 ? "md:col-span-2" : "col-span-1"
      }`}
    >
      <div className="relative z-10">
        <div className="mb-5 inline-flex rounded-md bg-[#3B82F6]/10 p-2.5">
          <Icon className="h-5 w-5 text-[#3B82F6]" />
        </div>
        <h3 className="mb-2 font-heading text-lg font-semibold text-[var(--lf-text-primary)]">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--lf-text-secondary)]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function FeatureCards() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll("[data-feature-card]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-5xl"
      style={{ padding: "0 var(--lf-pad-x)" }}
    >
      <div className="mb-16 text-center">
        <h2
          className="font-display font-bold uppercase text-[var(--lf-text-primary)]"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
          }}
        >
          Everything you need
        </h2>
        <p className="mt-4 text-[var(--lf-text-secondary)]">
          Powerful features, dead-simple interface.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
