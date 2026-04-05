"use client";

import { cn } from "@/lib/utils";

interface GradientBlurProps {
  className?: string;
  variant?: "hero" | "section";
}

export function GradientBlur({ className, variant = "hero" }: GradientBlurProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          "absolute rounded-full",
          "bg-[radial-gradient(circle,var(--lf-gradient-start)_0%,transparent_70%)]",
          "opacity-15 blur-[100px]",
          "animate-[blob-drift-1_20s_ease-in-out_infinite]",
          isHero ? "h-[500px] w-[500px] -top-40 -left-20" : "h-[300px] w-[300px] -top-20 -left-10"
        )}
      />
      <div
        className={cn(
          "absolute rounded-full",
          "bg-[radial-gradient(circle,var(--lf-gradient-end)_0%,transparent_70%)]",
          "opacity-15 blur-[100px]",
          "animate-[blob-drift-2_25s_ease-in-out_infinite]",
          isHero ? "h-[400px] w-[400px] top-1/3 -right-20" : "h-[250px] w-[250px] top-1/4 -right-10"
        )}
      />
      <div
        className={cn(
          "absolute rounded-full",
          "bg-[radial-gradient(circle,var(--lf-accent)_0%,transparent_70%)]",
          "opacity-10 blur-[100px]",
          "animate-[blob-drift-3_22s_ease-in-out_infinite]",
          isHero ? "h-[350px] w-[350px] -bottom-20 left-1/3" : "h-[200px] w-[200px] -bottom-10 left-1/4"
        )}
      />
    </div>
  );
}
