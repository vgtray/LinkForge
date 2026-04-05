"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Kim",
    handle: "@sarahkim",
    initials: "SK",
    quote:
      "I ditched Linktree the day I found LinkForge. The themes are gorgeous and my click-through rate doubled.",
  },
  {
    name: "Marcus Reed",
    handle: "@marcusreed",
    initials: "MR",
    quote:
      "The analytics alone are worth it. I finally know which links my audience actually cares about.",
  },
  {
    name: "Priya Sharma",
    handle: "@priyasharma",
    initials: "PS",
    quote:
      "Drag and drop editor is insanely smooth. Built my whole page in under 5 minutes.",
  },
  {
    name: "Jake Foster",
    handle: "@jakefoster",
    initials: "JF",
    quote:
      "Custom domain support out of the box. My page looks like it belongs on my own site. Love it.",
  },
  {
    name: "Amina Diallo",
    handle: "@aminadiallo",
    initials: "AD",
    quote:
      "The brutalist theme is fire. Everyone asks me who designed my link page. It was just LinkForge.",
  },
  {
    name: "Tom Nakamura",
    handle: "@tomnakamura",
    initials: "TN",
    quote:
      "Fastest link-in-bio I've ever used. Page loads instantly. No excuses for slow anymore.",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
}) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6]/20 text-sm font-semibold text-[#3B82F6]">
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--lf-text-primary)]">
            {testimonial.name}
          </p>
          <p className="text-xs text-[var(--lf-text-secondary)]">
            {testimonial.handle}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[var(--lf-text-secondary)]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  );
}

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-[var(--lf-text-primary)] sm:text-4xl">
          Loved by creators
        </h2>
        <p className="mt-3 text-[var(--lf-text-secondary)]">
          Join thousands who upgraded their online presence.
        </p>
      </div>

      <div
        ref={containerRef}
        className="group relative overflow-hidden"
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#09090B] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#09090B] to-transparent" />

        <motion.div
          className="flex gap-6"
          animate={{ x: [0, -320 * TESTIMONIALS.length - 6 * TESTIMONIALS.length] }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          whileHover={{ animationPlayState: "paused" }}
          style={{ willChange: "transform" }}
          onHoverStart={(_, info) => {
            // Handled by CSS for smoother pause
          }}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.handle}-${i}`} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
