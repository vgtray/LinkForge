"use client";

import { useRef } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "p" | "span";
}

export function TextReveal({
  children,
  className,
  delay = 0,
  tag: Tag = "h1",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const words = containerRef.current.querySelectorAll(".word-inner");

      gsap.fromTo(
        words,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.03,
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    [children, delay],
    containerRef
  );

  const words = children.split(" ");

  return (
    <div ref={containerRef}>
      <Tag className={cn("flex flex-wrap gap-x-[0.25em]", className)}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span className="word-inner inline-block">{word}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
