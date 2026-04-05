"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { THEME_PRESETS, type ThemeConfig } from "@/types";
import { Github, Twitter } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THEME_NAMES: Record<string, string> = {
  "minimal-light": "Minimal Light",
  "minimal-dark": "Minimal Dark",
  glassmorphism: "Glass",
  "gradient-neon": "Neon",
  brutalist: "Brutalist",
};

const MOCK_LINKS = [
  { title: "My Portfolio", url: "#" },
  { title: "Latest Project", url: "#" },
  { title: "Book a Call", url: "#" },
];

function PhoneMockup({ theme }: { theme: ThemeConfig }) {
  const isGradientButton =
    theme.buttonColor?.startsWith("linear-gradient") ?? false;

  return (
    <div className="relative mx-auto aspect-[9/19.5] w-full max-w-[280px] overflow-hidden rounded-[2.5rem] border-8 border-[#27272A] shadow-2xl shadow-black/50">
      <motion.div
        className="flex h-full flex-col items-center px-5 py-8"
        animate={{
          backgroundColor: theme.backgroundColor,
          backgroundImage: theme.backgroundGradient || "none",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Avatar */}
        <motion.div
          className="mb-3 h-16 w-16 rounded-full"
          animate={{ backgroundColor: theme.buttonColor?.startsWith("linear") ? theme.textColor : theme.buttonColor }}
          transition={{ duration: 0.5 }}
          style={{
            opacity: 0.2,
          }}
        />
        {/* Name */}
        <motion.p
          className="mb-1 text-sm font-semibold"
          animate={{ color: theme.textColor }}
          transition={{ duration: 0.5 }}
        >
          Alex Chen
        </motion.p>
        {/* Bio */}
        <motion.p
          className="mb-5 text-center text-xs opacity-60"
          animate={{ color: theme.textColor }}
          transition={{ duration: 0.5 }}
        >
          Designer & Developer
        </motion.p>

        {/* Links */}
        <div className="flex w-full flex-col gap-2.5">
          {MOCK_LINKS.map((link) => (
            <motion.div
              key={link.title}
              className="flex items-center justify-center px-4 py-2.5 text-xs font-medium"
              animate={{
                backgroundColor: isGradientButton
                  ? undefined
                  : theme.buttonColor,
                color: theme.buttonTextColor,
                borderRadius: theme.borderRadius,
                borderColor: theme.buttonStyle === "outline" ? theme.cardBorder : "transparent",
                borderWidth: theme.buttonStyle === "outline" ? "1px" : "0px",
                boxShadow:
                  theme.buttonStyle === "brutal"
                    ? `3px 3px 0px ${theme.textColor}`
                    : theme.buttonStyle === "glass"
                      ? "0 4px 30px rgba(0,0,0,0.1)"
                      : "none",
              }}
              style={
                isGradientButton
                  ? { backgroundImage: theme.buttonColor }
                  : undefined
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {link.title}
            </motion.div>
          ))}
        </div>

        {/* Social icons */}
        <div className="mt-auto flex gap-4 pt-4">
          <motion.div animate={{ color: theme.textColor }} transition={{ duration: 0.5 }}>
            <Github className="h-4 w-4 opacity-50" />
          </motion.div>
          <motion.div animate={{ color: theme.textColor }} transition={{ duration: 0.5 }}>
            <Twitter className="h-4 w-4 opacity-50" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DemoPreview() {
  const [activeTheme, setActiveTheme] = useState("minimal-dark");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
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
    <section ref={sectionRef} className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-[var(--lf-text-primary)] sm:text-4xl">
          See it in action
        </h2>
        <p className="mt-3 text-[var(--lf-text-secondary)]">
          Pick a theme. Watch it come alive.
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-16">
        {/* Theme selector */}
        <div className="flex flex-row flex-wrap justify-center gap-2 md:flex-col md:gap-3">
          {Object.keys(THEME_PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTheme(key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                activeTheme === key
                  ? "border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]"
                  : "border-[#27272A] bg-[#18181B] text-[var(--lf-text-secondary)] hover:border-[#3B82F6]/30 hover:text-[var(--lf-text-primary)]"
              }`}
            >
              {THEME_NAMES[key] || key}
            </button>
          ))}
        </div>

        {/* Phone mockup */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PhoneMockup theme={THEME_PRESETS[activeTheme]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
